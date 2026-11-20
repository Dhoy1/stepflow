/**
 * Utility untuk URL Slug dan ID Workflow StepFlow
 * Bersih, aman, dan kompatibel untuk Client & Server
 */

export function createSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export function extractWorkflowId(input: string): string {
  if (!input) return '';
  const decoded = decodeURIComponent(input);
  if (decoded.includes('--')) {
    const parts = decoded.split('--');
    if (parts[0].startsWith('wf_')) return parts[0];
    if (parts[parts.length - 1].startsWith('wf_')) return parts[parts.length - 1];
    return parts[0];
  }
  return decoded;
}

