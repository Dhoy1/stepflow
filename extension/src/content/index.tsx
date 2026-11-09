import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingDock } from './FloatingDock';
import {
  generateStepInstruction,
  getElementSelector,
  getElementReadableLabel,
  isWritableTextInput,
  isDropdownTriggerElement,
  isDropdownOptionElement,
  findDropdownContainer,
  findModalOrPopupContainer,
  findDropdownLabel
} from '../lib/heuristics';
import type { RecordingStatus, TargetElementMeta, Workflow, Step } from '../types';

/**
 * Safe wrapper for chrome.runtime.sendMessage.
 * Silently ignores "Extension context invalidated" errors that happen when
 * the extension is reloaded while content scripts are still running.
 */
function isExtensionContextValid(): boolean {
  try {
    return Boolean(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
  } catch {
    return false;
  }
}

function safeRuntimeMessage(
  message: any,
  callback?: (response: any) => void
): void {
  try {
    if (!isExtensionContextValid()) return;
    chrome.runtime.sendMessage(message, (response) => {
      try {
        if (!isExtensionContextValid()) return;
        const lastErr = chrome.runtime.lastError;
        if (lastErr) return;
        if (callback) callback(response);
      } catch {}
    });
  } catch (err: any) {
    // Silently ignore context invalidated errors
  }
}

// Suppress uncaught extension context invalidated errors from bubbling to chrome://extensions error panel
window.addEventListener('error', (e) => {
  if (e.message && (e.message.includes('Extension context invalidated') || e.message.includes('context invalidated'))) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);

window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message && (e.reason.message.includes('Extension context invalidated') || e.reason.message.includes('context invalidated'))) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}, true);

let dockHost: HTMLElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let dockReactRoot: ReactDOM.Root | null = null;

let currentStatus: RecordingStatus = 'idle';
let currentStepCount = 0;

// Render or update floating dock in Shadow DOM to isolate styles
function updateDock() {
  if (currentStatus === 'idle') {
    if (dockReactRoot) {
      dockReactRoot.unmount();
      dockReactRoot = null;
    }
    if (dockHost && dockHost.parentNode) {
      dockHost.parentNode.removeChild(dockHost);
      dockHost = null;
      shadowRoot = null;
    }
    return;
  }

  if (!dockHost) {
    dockHost = document.createElement('stepflow-dock-root');
    dockHost.style.position = 'fixed';
    dockHost.style.zIndex = '2147483647';
    document.body.appendChild(dockHost);

    shadowRoot = dockHost.attachShadow({ mode: 'open' });

    // Inject dock pulse animation keyframes into shadow dom
    const style = document.createElement('style');
    style.textContent = `
      @keyframes stepflow-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.2); }
      }
    `;
    shadowRoot.appendChild(style);

    const mountPoint = document.createElement('div');
    shadowRoot.appendChild(mountPoint);
    dockReactRoot = ReactDOM.createRoot(mountPoint);
  }

  if (dockReactRoot) {
    dockReactRoot.render(
      <FloatingDock
        status={currentStatus}
        stepCount={currentStepCount}
        onPause={() => safeRuntimeMessage({ type: 'PAUSE_RECORDING' })}
        onResume={() => safeRuntimeMessage({ type: 'RESUME_RECORDING' })}
        onComplete={() => safeRuntimeMessage({ type: 'STOP_RECORDING' })}
        onDiscard={() => {
          if (confirm('Apakah Anda yakin ingin membatalkan rekaman ini?')) {
            safeRuntimeMessage({ type: 'DISCARD_RECORDING' });
          }
        }}
      />
    );
  }
}

// Sembunyikan dock sebelum screenshot diambil agar gambar 100% bersih
function hideDockBeforeCapture() {
  if (dockHost) {
    dockHost.style.visibility = 'hidden';
  }
}

// Extract element metadata
function extractElementMeta(el: HTMLElement): TargetElementMeta {
  const rect = el.getBoundingClientRect();
  const isInput = isWritableTextInput(el);
  const isPassword = (el as HTMLInputElement).type === 'password';
  const val = isInput 
    ? (isPassword ? '••••••••' : ((el as HTMLInputElement).value || el.innerText || '').trim())
    : undefined;

  return {
    tagName: el.tagName.toLowerCase(),
    id: el.id || undefined,
    className: typeof el.className === 'string' ? el.className : undefined,
    innerText: el.innerText ? el.innerText.trim().slice(0, 100) : undefined,
    placeholder: (el as HTMLInputElement).placeholder || undefined,
    ariaLabel: el.getAttribute('aria-label') || undefined,
    selector: getElementSelector(el),
    rect: {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      devicePixelRatio: window.devicePixelRatio || 1
    },
    inputValue: val
  };
}

let isCapturingStep = false;
let pendingCaptureQueue: (() => void)[] = [];

function sendCaptureMessage(
  actionType: 'click' | 'input' | 'change' | 'select',
  instruction: { title: string; description: string },
  targetMeta: TargetElementMeta,
  onCompleted?: () => void
) {
  if (isCapturingStep) {
    // Queue sequentially to avoid missing steps during rapid clicks
    pendingCaptureQueue.push(() => {
      sendCaptureMessage(actionType, instruction, targetMeta, onCompleted);
    });
    return;
  }
  isCapturingStep = true;

  // Sembunyikan dock sebelum screenshot diambil agar gambar 100% bersih tanpa elemen ekstensi
  hideDockBeforeCapture();

  // Safety fallback: pastikan dock selalu muncul kembali setelah maksimal 450ms
  const safetyTimer = setTimeout(() => {
    isCapturingStep = false;
    if (dockHost && dockHost.style.visibility === 'hidden') {
      dockHost.style.visibility = 'visible';
    }
    const nextTask = pendingCaptureQueue.shift();
    if (nextTask) nextTask();
  }, 450);

  // Send capture message immediately without RAF delay so popup/modal is captured before DOM unmounts!
  safeRuntimeMessage(
    {
      type: 'CAPTURE_STEP',
      payload: {
        actionType,
        title: instruction.title,
        description: instruction.description,
        targetElement: targetMeta,
        url: window.location.href,
        pageTitle: document.title
      }
    },
    () => {
      clearTimeout(safetyTimer);
      isCapturingStep = false;
      if (dockHost) {
        dockHost.style.visibility = 'visible';
      }
      if (onCompleted) {
        try {
          onCompleted();
        } catch {}
      }
      const nextTask = pendingCaptureQueue.shift();
      if (nextTask) nextTask();
    }
  );
}

// Typing state management for debounced input capture
let pendingInputTimer: any = null;
let pendingInputElement: HTMLElement | null = null;
let initialInputValue: string = '';
let hasUserTypedInPendingInput = false;

function commitPendingTextInput() {
  if (pendingInputTimer) {
    clearTimeout(pendingInputTimer);
    pendingInputTimer = null;
  }
  const inputEl = pendingInputElement;
  if (!inputEl) return;
  pendingInputElement = null;

  if (currentStatus !== 'recording') return;

  const isPassword = (inputEl as HTMLInputElement).type === 'password';
  const val = (inputEl as HTMLInputElement).value !== undefined 
    ? (inputEl as HTMLInputElement).value 
    : (inputEl.innerText || '').trim();

  // If user hasn't typed anything and value is unchanged, skip recording an empty step
  if (!hasUserTypedInPendingInput && val === initialInputValue) {
    return;
  }
  if (!val && !initialInputValue) {
    return;
  }

  const targetMeta = extractElementMeta(inputEl);
  targetMeta.inputValue = isPassword ? '••••••••' : val;

  const instruction = generateStepInstruction('input', inputEl, targetMeta);
  sendCaptureMessage('input', instruction, targetMeta);
}

let latestMouseDownInfo: {
  target: HTMLElement;
  meta: TargetElementMeta;
  timestamp: number;
} | null = null;

function getSafeElementMeta(el: HTMLElement): TargetElementMeta {
  const current = extractElementMeta(el);
  if (
    latestMouseDownInfo &&
    Date.now() - latestMouseDownInfo.timestamp < 1200 &&
    (latestMouseDownInfo.target === el ||
      latestMouseDownInfo.target.contains(el) ||
      el.contains(latestMouseDownInfo.target))
  ) {
    // If element has collapsed (width or height is 0 or moved offscreen) while mousedown had valid rect
    if (
      (current.rect.width === 0 || current.rect.height === 0 || current.rect.x < -50 || current.rect.y < -50) &&
      latestMouseDownInfo.meta.rect.width > 0 &&
      latestMouseDownInfo.meta.rect.height > 0
    ) {
      return {
        ...current,
        rect: latestMouseDownInfo.meta.rect
      };
    }
  }
  return current;
}

// Listen for interactions on the page
let lastPreCaptureTime = 0;

function setupEventListeners() {
  // Pre-capture screenshot on mousedown so dropdowns and modals are captured 100% open
  // before the webpage's click/unmount handlers run!
  window.addEventListener(
    'mousedown',
    (event) => {
      if (currentStatus !== 'recording') return;
      if (!isExtensionContextValid()) return;

      const target = event.target as HTMLElement | null;
      if (!target || target === document.documentElement || target === document.body) return;

      // Skip text inputs - they don't capture click steps anyway and would waste capture quota
      if (isWritableTextInput(target)) return;

      // Ignore interactions inside StepFlow's own UI
      if (dockHost && (dockHost.contains(target) || event.composedPath().includes(dockHost))) {
        return;
      }

      // Immediately hide dock so it is never visible in the pre-captured screenshot
      hideDockBeforeCapture();

      // Cache element metadata at the moment of mousedown
      try {
        latestMouseDownInfo = {
          target,
          meta: extractElementMeta(target),
          timestamp: Date.now()
        };
      } catch {}

      // Throttle pre-capture (at least 200ms apart) to prevent Chrome rate limit errors
      const now = Date.now();
      if (now - lastPreCaptureTime >= 200) {
        lastPreCaptureTime = now;
        safeRuntimeMessage({ type: 'PRE_CAPTURE' });
      }
    },
    true
  );

  // Restore dock visibility if mouseup occurs without a recorded step (e.g. cancelled drag/click)
  window.addEventListener(
    'mouseup',
    () => {
      if (!isCapturingStep && dockHost && dockHost.style.visibility === 'hidden') {
        dockHost.style.visibility = 'visible';
      }
    },
    true
  );

  // Capture Click
  window.addEventListener(
    'click',
    (event) => {
      if (currentStatus !== 'recording') return;

      const rawTarget = event.target as HTMLElement | null;
      if (!rawTarget || rawTarget === document.documentElement || rawTarget === document.body) return;

      // Ignore interactions inside StepFlow's own UI
      if (dockHost && (dockHost.contains(rawTarget) || event.composedPath().includes(dockHost))) {
        return;
      }

      // 1. If user clicked inside a writable text input (focusing to type)
      if (isWritableTextInput(rawTarget)) {
        // If switching from another input, commit previous input first
        if (pendingInputElement && pendingInputElement !== rawTarget) {
          commitPendingTextInput();
        }
        // Do NOT capture an empty click step! Prepare for typing instead.
        pendingInputElement = rawTarget;
        initialInputValue = (rawTarget as HTMLInputElement).value !== undefined
          ? (rawTarget as HTMLInputElement).value
          : (rawTarget.innerText || '');
        hasUserTypedInPendingInput = false;
        return;
      }

      // If user had an active text input open and clicked outside, commit the typed text!
      if (pendingInputElement) {
        commitPendingTextInput();
      }

      // 2. If user clicked a native <select> element
      if (rawTarget.tagName.toLowerCase() === 'select' || rawTarget.closest('select')) {
        // Do not capture click step; the change event will capture once option is picked!
        return;
      }

      // 3. If user clicked a Custom Dropdown Option
      const dropdownOption = isDropdownOptionElement(rawTarget);
      if (dropdownOption) {
        const optionText = (dropdownOption.innerText || dropdownOption.textContent || '').trim().replace(/\s+/g, ' ');
        const ddLabel = findDropdownLabel(dropdownOption);
        const targetMeta = getSafeElementMeta(dropdownOption);
        targetMeta.isDropdownOption = true;
        targetMeta.selectedText = optionText;

        const instruction = generateStepInstruction('select', dropdownOption, targetMeta, ddLabel);
        sendCaptureMessage('select', instruction, targetMeta);
        return;
      }

      // 4. If user clicked a Dropdown Trigger / Toggle Button
      const dropdownTrigger = isDropdownTriggerElement(rawTarget);
      if (dropdownTrigger) {
        const targetMeta = getSafeElementMeta(dropdownTrigger);
        targetMeta.isDropdownTrigger = true;
        const instruction = generateStepInstruction('click', dropdownTrigger, targetMeta);
        sendCaptureMessage('click', instruction, targetMeta);
        return;
      }

      // 5. Standard Click (Buttons, Links, Checkboxes, Radios, Cards, Modal buttons, etc.)
      let target = rawTarget;
      const parentInteractive = rawTarget.closest('button, a, [role="button"], label, tr, li, [tabindex]') as HTMLElement | null;
      if (parentInteractive && !['BODY', 'HTML'].includes(parentInteractive.tagName)) {
        const rawText = (rawTarget.innerText || '').trim();
        if (!rawText || rawTarget.tagName.toLowerCase() === 'svg' || rawTarget.tagName.toLowerCase() === 'path') {
          target = parentInteractive;
        }
      }

      // Never record raw html or body
      if (!target || target === document.documentElement || target === document.body) return;

      const targetMeta = getSafeElementMeta(target);
      const instruction = generateStepInstruction('click', target, targetMeta);
      sendCaptureMessage('click', instruction, targetMeta);
    },
    true // Capture phase
  );

  // Capture Typing in Inputs (Debounced)
  window.addEventListener(
    'input',
    (event) => {
      if (currentStatus !== 'recording') return;

      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (dockHost && (dockHost.contains(target) || event.composedPath().includes(dockHost))) return;

      if (isWritableTextInput(target)) {
        pendingInputElement = target;
        hasUserTypedInPendingInput = true;

        if (pendingInputTimer) {
          clearTimeout(pendingInputTimer);
        }
        pendingInputTimer = setTimeout(() => {
          commitPendingTextInput();
        }, 750);
      }
    },
    true
  );

  // Capture Enter Key Submission
  window.addEventListener(
    'keydown',
    (event) => {
      if (currentStatus !== 'recording') return;
      if (event.key === 'Enter') {
        const target = event.target as HTMLElement | null;
        if (target && isWritableTextInput(target)) {
          commitPendingTextInput();
        }
      }
    },
    true
  );

  // Capture Focusout / Blur from Text Inputs
  window.addEventListener(
    'focusout',
    (event) => {
      if (currentStatus !== 'recording') return;
      const target = event.target as HTMLElement | null;
      if (target && target === pendingInputElement) {
        setTimeout(() => {
          if (pendingInputElement === target) {
            commitPendingTextInput();
          }
        }, 60);
      }
    },
    true
  );

  // Capture Change (Native Selects & form controls)
  window.addEventListener(
    'change',
    (event) => {
      if (currentStatus !== 'recording') return;

      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (dockHost && (dockHost.contains(target) || event.composedPath().includes(dockHost))) {
        return;
      }

      // A. Native <select>
      if (target instanceof HTMLSelectElement) {
        const selectedOption = target.options?.[target.selectedIndex];
        const optionText = selectedOption?.text?.trim() || target.value;
        const targetMeta = extractElementMeta(target);
        targetMeta.selectedText = optionText;

        const instruction = generateStepInstruction('change', target, targetMeta);
        sendCaptureMessage('change', instruction, targetMeta);
        return;
      }

      // B. Writable text input change
      if (isWritableTextInput(target)) {
        hasUserTypedInPendingInput = true;
        commitPendingTextInput();
        return;
      }

      // C. Other controls (file input, range, checkbox, etc.)
      const targetMeta = extractElementMeta(target);
      const instruction = generateStepInstruction('change', target, targetMeta);
      sendCaptureMessage('change', instruction, targetMeta);
    },
    true
  );
}

// Listen to messages from background service worker
try {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
      if (message.type === 'PING') {
        sendResponse({ pong: true });
        return true;
      }
      if (message.type === 'RECORDING_STATUS_CHANGED') {
        currentStatus = message.payload.status;
        currentStepCount = message.payload.stepCount || 0;
        updateDock();
        sendResponse({ ok: true });
        return true;
      }
    } catch (err) {
      // Silently ignore extension context errors
    }
  });
} catch (err) {
  // Extension context invalidated - cannot register message listener
}

// Initialize on page load
setupEventListeners();

// Query initial status on script injection
safeRuntimeMessage({ type: 'GET_STATUS' }, (res) => {
  if (res && res.status) {
    currentStatus = res.status;
    currentStepCount = res.stepCount || 0;
    updateDock();
  }
});

// Clean up any stale in-page guide markers or split-screen styles
try {
  const staleSplitscreen = document.getElementById('stepflow-splitscreen-css');
  if (staleSplitscreen) staleSplitscreen.remove();
  const staleGuide = document.querySelector('stepflow-guideme-root');
  if (staleGuide) staleGuide.remove();
  const staleSpotlight = document.getElementById('stepflow-spotlight-box');
  if (staleSpotlight) staleSpotlight.remove();
  const staleBadge = document.getElementById('stepflow-floating-badge');
  if (staleBadge) staleBadge.remove();
  if (document.body) document.body.style.marginRight = '';
  if (window.name && window.name.includes('__stepflow_guide')) window.name = '';
} catch {}




