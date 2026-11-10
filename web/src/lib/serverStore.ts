import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from './supabase';
import { pool, isMySQLConfigured } from './mysql';
import type { Workflow, TeamProfile } from '../types';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'workflows.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]), 'utf-8');
  }
}

function readLocalWorkflows(): Workflow[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalWorkflows(list: Workflow[]) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(list, null, 2), 'utf-8');
}

function parseJsonSafe(val: any) {
  if (!val) return undefined;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return undefined;
  }
}

export async function getWorkflowById(id: string): Promise<Workflow | null> {
  // 1. Prioritas Utama: MySQL (Laragon / Hostinger)
  if (isMySQLConfigured && pool) {
    try {
      const [wRows]: any = await pool.execute('SELECT * FROM workflows WHERE id = ?', [id]);
      if (!wRows || wRows.length === 0) return null;
      const wf = wRows[0];

      const [sRows]: any = await pool.execute(
        'SELECT * FROM steps WHERE workflow_id = ? ORDER BY order_index ASC',
        [id]
      );

      const [logRows]: any = await pool.execute(
        'SELECT * FROM workflow_edit_logs WHERE workflow_id = ? ORDER BY edited_at DESC LIMIT 20',
        [id]
      ).catch(() => [[]]);

      return {
        id: wf.id,
        title: wf.title,
        description: wf.description || '',
        category: wf.category || 'General SOP',
        createdAt: new Date(wf.created_at).getTime(),
        updatedAt: new Date(wf.updated_at).getTime(),
        targetUrl: wf.target_url || '',
        author: wf.author || 'Tim Perusahaan',
        lastEditedBy: wf.last_edited_by || undefined,
        editLogs: (logRows || []).map((l: any) => ({
          id: l.id,
          workflowId: l.workflow_id,
          editorName: l.editor_name,
          editedAt: new Date(l.edited_at).getTime()
        })),
        steps: (sRows || []).map((s: any) => ({
          id: s.id,
          order: s.order_index,
          actionType: s.action_type,
          title: s.title,
          description: s.description || '',
          url: s.url || '',
          pageTitle: s.page_title || '',
          screenshot: s.screenshot_url,
          annotatedScreenshot: s.screenshot_url,
          highlight: parseJsonSafe(s.highlight_json),
          callout: parseJsonSafe(s.callout_json),
          blurRegions: parseJsonSafe(s.blur_regions_json),
          targetElement: parseJsonSafe(s.target_element_json),
          arrows: parseJsonSafe(s.arrows_json) || []
        }))
      };
    } catch (err) {
      console.error('MySQL getWorkflowById error:', err);
    }
  }

  // 2. Fallback: Supabase
  if (isSupabaseConfigured && supabase) {
    const { data: wf, error } = await supabase
      .from('workflows')
      .select('*, steps(*)')
      .eq('id', id)
      .single();

    if (error || !wf) return null;

    return {
      id: wf.id,
      title: wf.title,
      description: wf.description || '',
      category: wf.category || 'General SOP',
      createdAt: new Date(wf.created_at).getTime(),
      updatedAt: new Date(wf.updated_at).getTime(),
      targetUrl: wf.target_url || '',
      author: wf.author,
      steps: (wf.steps || []).sort((a: any, b: any) => a.order_index - b.order_index).map((s: any) => ({
        id: s.id,
        order: s.order_index,
        actionType: s.action_type,
        title: s.title,
        description: s.description || '',
        url: s.url || '',
        pageTitle: s.page_title || '',
        screenshot: s.screenshot_url,
        annotatedScreenshot: s.screenshot_url,
        highlight: s.highlight,
        callout: s.callout,
        blurRegions: s.blur_regions,
        targetElement: s.target_element
      }))
    };
  }

  // 3. Fallback: File JSON Lokal
  const list = readLocalWorkflows();
  return list.find((w) => w.id === id) || null;
}

export async function getAllWorkflows(): Promise<Workflow[]> {
  // 1. Prioritas Utama: MySQL
  if (isMySQLConfigured && pool) {
    try {
      const [rows]: any = await pool.execute(
        `SELECT w.*, (SELECT COUNT(*) FROM steps s WHERE s.workflow_id = w.id) as step_count 
         FROM workflows w 
         ORDER BY w.created_at DESC`
      );

      return (rows || []).map((w: any) => ({
        id: w.id,
        title: w.title,
        description: w.description || '',
        category: w.category || 'General SOP',
        createdAt: new Date(w.created_at).getTime(),
        updatedAt: new Date(w.updated_at).getTime(),
        targetUrl: w.target_url || '',
        author: w.author,
        lastEditedBy: w.last_edited_by || undefined,
        steps: new Array(Number(w.step_count) || 0)
      }));
    } catch (err) {
      console.error('MySQL getAllWorkflows error:', err);
    }
  }

  // 2. Fallback: Supabase
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('workflows')
      .select('*, steps(count)')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((w: any) => ({
      id: w.id,
      title: w.title,
      description: w.description || '',
      category: w.category || 'General SOP',
      createdAt: new Date(w.created_at).getTime(),
      updatedAt: new Date(w.updated_at).getTime(),
      targetUrl: w.target_url || '',
      author: w.author,
      steps: new Array(w.steps?.[0]?.count || 0)
    }));
  }

  // 3. Fallback: File JSON Lokal
  const list = readLocalWorkflows();
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteWorkflowFromCloud(id: string): Promise<boolean> {
  // 1. Prioritas Utama: MySQL
  if (isMySQLConfigured && pool) {
    await pool.execute('DELETE FROM workflows WHERE id = ?', [id]);
    return true;
  }

  // 2. Fallback: Supabase
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('workflows').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  // 3. Fallback: File JSON Lokal
  const list = readLocalWorkflows();
  const filtered = list.filter((w) => w.id !== id);
  writeLocalWorkflows(filtered);
  return true;
}

let cachedStepColumns: Set<string> | null = null;

async function getAvailableStepColumns(mysqlPool: any): Promise<Set<string>> {
  if (cachedStepColumns) return cachedStepColumns;

  // Coba tambahkan kolom yang mungkin belum ada di tabel steps Hostinger / MySQL
  try {
    await mysqlPool.execute('ALTER TABLE steps ADD COLUMN target_element_json LONGTEXT NULL').catch(() => {});
  } catch {}
  try {
    await mysqlPool.execute('ALTER TABLE steps ADD COLUMN arrows_json LONGTEXT NULL').catch(() => {});
  } catch {}

  try {
    const [cols]: any = await mysqlPool.execute('SHOW COLUMNS FROM steps');
    if (Array.isArray(cols)) {
      const names = new Set<string>(cols.map((c: any) => String(c.Field).toLowerCase()));
      cachedStepColumns = names;
      return names;
    }
  } catch (err) {
    console.warn('Could not inspect steps table columns:', err);
  }

  return new Set([
    'id', 'workflow_id', 'order_index', 'action_type', 'title',
    'description', 'url', 'page_title', 'screenshot_url',
    'highlight_json', 'callout_json', 'blur_regions_json'
  ]);
}

export async function saveWorkflowToCloud(workflow: Workflow): Promise<{ success: boolean; id: string }> {
  // 1. Prioritas Utama: MySQL
  if (isMySQLConfigured && pool) {
    try {
      const editor = workflow.lastEditedBy || workflow.author || 'Tim Perusahaan';
      await pool.execute(
        `INSERT INTO workflows (id, title, description, category, target_url, author, last_edited_by, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE 
           title = VALUES(title), 
           description = VALUES(description), 
           category = VALUES(category), 
           target_url = VALUES(target_url), 
           author = VALUES(author), 
           last_edited_by = VALUES(last_edited_by),
           updated_at = NOW()`,
        [
          workflow.id,
          workflow.title,
          workflow.description || '',
          workflow.category || 'General SOP',
          workflow.targetUrl || '',
          workflow.author || 'Tim Perusahaan',
          editor
        ]
      );

      // Record edit log in workflow_edit_logs
      if (editor) {
        await pool.execute(
          `INSERT INTO workflow_edit_logs (workflow_id, editor_name, edited_at) VALUES (?, ?, NOW())`,
          [workflow.id, editor]
        ).catch((logErr: any) => console.warn('Could not insert edit log:', logErr));
      }

      if (workflow.steps && workflow.steps.length > 0) {
        await pool.execute('DELETE FROM steps WHERE workflow_id = ?', [workflow.id]);
        const availableCols = await getAvailableStepColumns(pool);

        for (let idx = 0; idx < workflow.steps.length; idx++) {
          const st = workflow.steps[idx];

          const cols: string[] = [
            'id',
            'workflow_id',
            'order_index',
            'action_type',
            'title',
            'description',
            'url',
            'page_title',
            'screenshot_url',
            'highlight_json',
            'callout_json',
            'blur_regions_json'
          ];
          const placeholders: string[] = ['?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?'];
          const values: any[] = [
            st.id,
            workflow.id,
            idx + 1,
            st.actionType || 'click',
            st.title || `Step ${idx + 1}`,
            st.description || '',
            st.url || '',
            st.pageTitle || '',
            st.annotatedScreenshot || st.screenshot || '',
            st.highlight ? JSON.stringify(st.highlight) : null,
            st.callout ? JSON.stringify(st.callout) : null,
            st.blurRegions ? JSON.stringify(st.blurRegions) : null
          ];

          if (availableCols.has('target_element_json')) {
            cols.push('target_element_json');
            placeholders.push('?');
            values.push(st.targetElement ? JSON.stringify(st.targetElement) : null);
          }

          if (availableCols.has('arrows_json')) {
            cols.push('arrows_json');
            placeholders.push('?');
            values.push(st.arrows ? JSON.stringify(st.arrows) : null);
          }

          await pool.execute(
            `INSERT INTO steps (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`,
            values
          );
        }
      }

      return { success: true, id: workflow.id };
    } catch (err) {
      console.error('MySQL saveWorkflowToCloud error:', err);
      throw err;
    }
  }

  // 2. Fallback: Supabase
  if (isSupabaseConfigured && supabase) {
    const { error: wfError } = await supabase.from('workflows').upsert({
      id: workflow.id,
      title: workflow.title,
      description: workflow.description,
      category: workflow.category || 'General SOP',
      target_url: workflow.targetUrl,
      author: workflow.author || 'Anonim',
      updated_at: new Date().toISOString()
    });

    if (wfError) throw wfError;

    if (workflow.steps && workflow.steps.length > 0) {
      const stepRows = workflow.steps.map((st, idx) => ({
        id: st.id,
        workflow_id: workflow.id,
        order_index: idx + 1,
        action_type: st.actionType,
        title: st.title,
        description: st.description,
        url: st.url,
        page_title: st.pageTitle,
        screenshot_url: st.annotatedScreenshot || st.screenshot,
        highlight: st.highlight,
        callout: st.callout,
        blur_regions: st.blurRegions,
        target_element: st.targetElement
      }));

      await supabase.from('steps').delete().eq('workflow_id', workflow.id);
      const { error: stepsError } = await supabase.from('steps').insert(stepRows);
      if (stepsError) throw stepsError;
    }

    return { success: true, id: workflow.id };
  }

  // 3. Fallback: File JSON Lokal
  const list = readLocalWorkflows();
  const existingIdx = list.findIndex((w) => w.id === workflow.id);
  if (existingIdx >= 0) {
    list[existingIdx] = workflow;
  } else {
    list.unshift(workflow);
  }
  writeLocalWorkflows(list);

  return { success: true, id: workflow.id };
}

let isTeamTableReady = false;

export async function ensureTeamAccountsTable(mysqlPool: any) {
  if (isTeamTableReady) return;
  try {
    await mysqlPool.execute(`
      CREATE TABLE IF NOT EXISTS team_accounts (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        pin VARCHAR(50) NOT NULL,
        role VARCHAR(50) DEFAULT 'editor',
        badge_color VARCHAR(50) DEFAULT 'emerald',
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const [rows]: any = await mysqlPool.execute('SELECT COUNT(*) as cnt FROM team_accounts');
    if ((rows?.[0]?.cnt || 0) === 0) {
      await mysqlPool.execute(`
        INSERT INTO team_accounts (id, name, pin, badge_color, role, is_active) VALUES
        ('team_1', 'Ridho', '24170', 'emerald', 'editor', 1),
        ('team_2', 'Hikam', '23721', 'blue', 'editor', 1),
        ('team_3', 'Fazril', '20642', 'purple', 'editor', 1)
      `);
    }
    isTeamTableReady = true;
  } catch (err) {
    console.error('ensureTeamAccountsTable error:', err);
  }
}

export async function getTeamAccountsFromDB(): Promise<TeamProfile[]> {
  // 1. Prioritas Utama: MySQL
  if (isMySQLConfigured && pool) {
    try {
      await ensureTeamAccountsTable(pool);
      const [rows]: any = await pool.execute(
        'SELECT id, name, pin, badge_color, role, is_active FROM team_accounts WHERE is_active = 1 ORDER BY created_at ASC'
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          pin: String(r.pin),
          badgeColor: r.badge_color || 'emerald',
          role: r.role || 'editor',
          isActive: Boolean(r.is_active)
        }));
      }
    } catch (err) {
      console.error('MySQL getTeamAccountsFromDB error:', err);
    }
  }

  // 2. Default Fallback
  return [
    { id: 'team_1', name: 'Ridho', pin: '24170', badgeColor: 'emerald', role: 'editor', isActive: true },
    { id: 'team_2', name: 'Hikam', pin: '23721', badgeColor: 'blue', role: 'editor', isActive: true },
    { id: 'team_3', name: 'Fazril', pin: '20642', badgeColor: 'purple', role: 'editor', isActive: true }
  ];
}

export async function saveTeamAccountToDB(account: TeamProfile): Promise<boolean> {
  if (isMySQLConfigured && pool) {
    try {
      await ensureTeamAccountsTable(pool);
      await pool.execute(
        `INSERT INTO team_accounts (id, name, pin, badge_color, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           name = VALUES(name),
           pin = VALUES(pin),
           badge_color = VALUES(badge_color),
           role = VALUES(role),
           is_active = VALUES(is_active)`,
        [
          account.id,
          account.name,
          account.pin,
          account.badgeColor || 'emerald',
          account.role || 'editor',
          account.isActive !== false ? 1 : 0
        ]
      );
      return true;
    } catch (err) {
      console.error('MySQL saveTeamAccountToDB error:', err);
      throw err;
    }
  }
  return false;
}

export async function deleteTeamAccountFromDB(id: string): Promise<boolean> {
  if (isMySQLConfigured && pool) {
    try {
      await ensureTeamAccountsTable(pool);
      await pool.execute('DELETE FROM team_accounts WHERE id = ?', [id]);
      return true;
    } catch (err) {
      console.error('MySQL deleteTeamAccountFromDB error:', err);
      throw err;
    }
  }
  return false;
}
