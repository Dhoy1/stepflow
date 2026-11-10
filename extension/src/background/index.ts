import { db, saveWorkflow } from '../lib/db';
import { DEFAULT_WORKFLOWS_API } from '../lib/config';
import type { Workflow, Step, RecordingStatus, ExtensionMessage } from '../types';

let currentWorkflow: Workflow | null = null;
let recordingStatus: RecordingStatus = 'idle';
let activeRecordingTabId: number | null = null;
let latestPreCapture: { promise: Promise<string>; timestamp: number } | null = null;

// Restore state from chrome.storage if service worker was suspended
async function ensureStateRestored() {
  if (recordingStatus === 'idle' && !currentWorkflow) {
    try {
      const stored = await chrome.storage.local.get([
        'recordingStatus',
        'activeWorkflowId',
        'activeRecordingTabId'
      ]);
      if (stored.recordingStatus && stored.recordingStatus !== 'idle' && stored.activeWorkflowId) {
        recordingStatus = stored.recordingStatus;
        activeRecordingTabId = stored.activeRecordingTabId || null;
        currentWorkflow = (await db.workflows.get(stored.activeWorkflowId)) || null;
        if (recordingStatus !== 'idle') {
          await broadcastStatus();
        }
      }
    } catch (e) {
      console.warn('Failed to restore SW state:', e);
    }
  }
}

// Persist state to storage
async function persistState() {
  try {
    const toSave: Record<string, any> = {};
    if (recordingStatus === 'idle' || !currentWorkflow) {
      await chrome.storage.local.remove(['recordingStatus', 'activeWorkflowId', 'activeRecordingTabId', 'stepflow_guide_sessions']);
    } else {
      toSave.recordingStatus = recordingStatus;
      toSave.activeWorkflowId = currentWorkflow.id;
      toSave.activeRecordingTabId = activeRecordingTabId;
      await chrome.storage.local.set(toSave);
    }
  } catch (e) {
    console.warn('Failed to persist SW state:', e);
  }
}

// Helper to broadcast state to all tabs or active tab & update toolbar badge
async function broadcastStatus() {
  try {
    if (recordingStatus === 'recording') {
      const count = currentWorkflow ? currentWorkflow.steps.length : 0;
      await chrome.action.setBadgeText({ text: count > 0 ? String(count) : 'REC' });
      await chrome.action.setBadgeBackgroundColor({ color: '#FF5C35' });
    } else if (recordingStatus === 'paused') {
      await chrome.action.setBadgeText({ text: 'PAUSE' });
      await chrome.action.setBadgeBackgroundColor({ color: '#64748B' });
    } else {
      await chrome.action.setBadgeText({ text: '' });
    }
  } catch (err) {
    // Toolbar action API not available or tab query error
  }

  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'RECORDING_STATUS_CHANGED',
        payload: {
          status: recordingStatus,
          stepCount: currentWorkflow ? currentWorkflow.steps.length : 0,
          workflowTitle: currentWorkflow?.title || ''
        }
      }).catch(() => {
        // Tab might not have content script loaded, ignore error
      });
    }
  }
}

// Generate simple UUID
function generateId(): string {
  return 'wf_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

// Global capture mutex & rate-limit throttling to prevent MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND
let activeCapturePromise: Promise<string> | null = null;
let lastCaptureCompletedTime = 0;

async function safeCaptureTab(windowId?: number): Promise<string> {
  // If a capture is currently in progress, wait for it or reuse
  if (activeCapturePromise) {
    try {
      return await activeCapturePromise;
    } catch { }
  }

  // Ensure at least 80ms spacing to prevent MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND
  const timeSinceLast = Date.now() - lastCaptureCompletedTime;
  if (timeSinceLast < 80) {
    await new Promise((r) => setTimeout(r, 80 - timeSinceLast));
  }

  const doCapture = async (retries = 2): Promise<string> => {
    try {
      let dataUrl: string;
      if (typeof windowId === 'number') {
        dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
      } else {
        dataUrl = await chrome.tabs.captureVisibleTab({ format: 'png' });
      }
      lastCaptureCompletedTime = Date.now();
      return dataUrl;
    } catch (err: any) {
      if (retries > 0 && err?.message?.includes('MAX_CAPTURE_VISIBLE_TAB')) {
        await new Promise((r) => setTimeout(r, 200));
        return doCapture(retries - 1);
      }
      throw err;
    }
  };

  activeCapturePromise = doCapture().finally(() => {
    activeCapturePromise = null;
  });

  return activeCapturePromise;
}

// Listen to messages from Popup or Content Script
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  const handleMessage = async () => {
    await ensureStateRestored();

    switch (message.type) {
      case 'GET_STATUS': {
        return {
          status: recordingStatus,
          stepCount: currentWorkflow ? currentWorkflow.steps.length : 0,
          workflow: currentWorkflow
        };
      }

      case 'START_RECORDING': {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!activeTab || !activeTab.id) {
          throw new Error('Tidak ada tab aktif yang dapat direkam.');
        }

        const tabUrl = activeTab.url || '';
        if (
          tabUrl.startsWith('chrome://') ||
          tabUrl.startsWith('edge://') ||
          tabUrl.startsWith('chrome-extension://') ||
          tabUrl.startsWith('about:') ||
          tabUrl.startsWith('view-source:')
        ) {
          throw new Error(
            'Ekstensi tidak dapat merekam halaman internal browser (chrome:// atau edge://).\nSilakan buka tab website biasa (misal: google.com atau sistem kerja Anda).'
          );
        }

        activeRecordingTabId = activeTab.id;
        recordingStatus = 'recording';

        // Check if user requested to APPEND to an existing tutorial
        if (message.payload?.appendToId) {
          let existing = await db.workflows.get(message.payload.appendToId);
          if (!existing) {
            try {
              const res = await fetch(`${DEFAULT_WORKFLOWS_API}/${message.payload.appendToId}`);
              if (res.ok) {
                existing = await res.json();
                if (existing) {
                  await db.workflows.put(existing);
                }
              }
            } catch (e) {
              console.warn('Failed to fetch workflow from cloud to append:', e);
            }
          }
          if (existing) {
            currentWorkflow = existing;
          }
        }

        if (!currentWorkflow) {
          currentWorkflow = {
            id: generateId(),
            title: message.payload?.title || activeTab.title || 'New Workflow Guide',
            description: 'Step-by-step tutorial automatically captured from website workflow.',
            category: message.payload?.category || 'General',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            targetUrl: tabUrl,
            steps: []
          };
        }

        // Save immediately to DB & persist state
        await saveWorkflow(currentWorkflow);
        await persistState();

        // Check if content script is active in tab; if not, inject dynamically!
        try {
          const res = await chrome.tabs.sendMessage(activeRecordingTabId, { type: 'PING' });
          if (!res?.pong) throw new Error('No pong');
        } catch {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: activeRecordingTabId },
              files: ['content.js']
            });
            await chrome.scripting.insertCSS({
              target: { tabId: activeRecordingTabId },
              files: ['content.css']
            }).catch(() => { });
          } catch (injectErr) {
            console.warn('Could not inject content script:', injectErr);
          }
        }

        // Notify content script in the active tab to show dock
        await chrome.tabs.sendMessage(activeRecordingTabId, {
          type: 'RECORDING_STATUS_CHANGED',
          payload: {
            status: recordingStatus,
            stepCount: currentWorkflow.steps.length,
            workflowTitle: currentWorkflow.title
          }
        }).catch(() => { });

        await broadcastStatus();
        return { status: recordingStatus, workflowId: currentWorkflow.id };
      }

      case 'PAUSE_RECORDING': {
        recordingStatus = 'paused';
        await persistState();
        await broadcastStatus();
        return { status: recordingStatus };
      }

      case 'RESUME_RECORDING': {
        recordingStatus = 'recording';
        await persistState();
        await broadcastStatus();
        return { status: recordingStatus };
      }

      case 'PRE_CAPTURE': {
        if (recordingStatus === 'recording') {
          const windowId = sender.tab?.windowId;
          const capturePromise = safeCaptureTab(windowId);
          latestPreCapture = {
            promise: capturePromise,
            timestamp: Date.now()
          };
          capturePromise.catch(() => { });
        }
        return { success: true };
      }

      case 'CAPTURE_STEP': {
        if (recordingStatus !== 'recording' || !currentWorkflow) {
          return { error: 'Not in recording mode' };
        }

        try {
          // 1. Try to use instant screenshot pre-captured on mousedown
          let screenshotDataUrl: string = '';
          const now = Date.now();
          if (latestPreCapture && (now - latestPreCapture.timestamp) < 1500) {
            try {
              screenshotDataUrl = await latestPreCapture.promise;
            } catch { }
          }
          latestPreCapture = null;

          // 2. Fallback: Take fresh screenshot immediately
          if (!screenshotDataUrl) {
            const windowId = sender.tab?.windowId;
            screenshotDataUrl = await safeCaptureTab(windowId);
          }

          const meta = message.payload;
          const dpr = meta.targetElement?.viewport?.devicePixelRatio || 1;
          const rect = meta.targetElement?.rect;

          const newStep: Step = {
            id: generateId(),
            order: currentWorkflow.steps.length + 1,
            actionType: meta.actionType || 'click',
            title: meta.title || `Step ${currentWorkflow.steps.length + 1}`,
            description: meta.description || '',
            url: meta.url || sender.tab?.url || '',
            pageTitle: meta.pageTitle || sender.tab?.title || '',
            targetElement: meta.targetElement,
            screenshot: screenshotDataUrl,
            originalScreenshot: screenshotDataUrl,
            annotatedScreenshot: screenshotDataUrl,
            callout: { type: 'none', text: '' },
            highlight: rect ? {
              x: Math.round(rect.x * dpr),
              y: Math.round(rect.y * dpr),
              width: Math.round(rect.width * dpr),
              height: Math.round(rect.height * dpr),
              color: '#FF5C35',
              style: 'border'
            } : undefined
          };

          currentWorkflow.steps.push(newStep);
          currentWorkflow.updatedAt = Date.now();

          // Save progress in IndexedDB
          await saveWorkflow(currentWorkflow);
          await persistState();

          // Notify dock of step count change
          await broadcastStatus();

          return { success: true, stepCount: currentWorkflow.steps.length };
        } catch (err: any) {
          console.error('Failed to capture screenshot:', err);
          return { error: err.message };
        }
      }

      case 'STOP_RECORDING': {
        if (!currentWorkflow) return { error: 'No active recording' };

        const finishedWorkflow = { ...currentWorkflow };
        recordingStatus = 'idle';
        currentWorkflow = null;
        await persistState();

        await broadcastStatus();

        // Save final workflow
        await saveWorkflow(finishedWorkflow);

        // Open editor tab
        const editorUrl = chrome.runtime.getURL(`editor.html?id=${finishedWorkflow.id}`);
        await chrome.tabs.create({ url: editorUrl });

        return { success: true, workflowId: finishedWorkflow.id };
      }

      case 'DISCARD_RECORDING': {
        if (currentWorkflow) {
          await db.workflows.delete(currentWorkflow.id);
        }
        currentWorkflow = null;
        recordingStatus = 'idle';
        await persistState();
        await broadcastStatus();
        return { success: true };
      }

      case 'OPEN_EDITOR': {
        const id = message.payload?.id;
        const url = id
          ? chrome.runtime.getURL(`editor.html?id=${id}`)
          : chrome.runtime.getURL('editor.html');
        await chrome.tabs.create({ url });
        return { success: true };
      }

      case 'GET_WORKFLOW': {
        const id = message.payload?.id;
        if (!id) return { error: 'Missing workflow id' };

        // 1. Try local IndexedDB
        let wf = await db.workflows.get(id);
        if (wf) return { workflow: wf };

        // 2. Try fetching from Cloud API (Hostinger)
        try {
          const res = await fetch(`${DEFAULT_WORKFLOWS_API}/${id}`);
          if (res.ok) {
            wf = await res.json();
            return { workflow: wf };
          }
        } catch (e) {
          console.warn('Could not fetch workflow from cloud API:', e);
        }

        // 3. Fallback to Local API
        try {
          const localRes = await fetch(`http://localhost:3000/api/workflows/${id}`);
          if (localRes.ok) {
            wf = await localRes.json();
            return { workflow: wf };
          }
        } catch { }

        return { error: 'Workflow not found' };
      }

      case 'WORKFLOW_UPDATED': {
        return { success: true };
      }

      default:
        return { error: 'Unknown message type' };
    }
  };

  handleMessage().then(sendResponse).catch((err) => {
    sendResponse({ error: err.message });
  });

  return true; // Keep message channel open for async response
});

// Update badge on extension icon based on status
chrome.storage.onChanged.addListener(() => {
  // Sync if needed
});

