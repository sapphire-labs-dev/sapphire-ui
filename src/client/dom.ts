// Small DOM helpers shared by the tool sites. Text is always set via textContent,
// never innerHTML, so user-entered names and notes cannot inject markup.

export const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K, props: Partial<Record<string, string | boolean | number>> = {}, ...children: (Node | string | null)[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === false) continue;
    if (k === 'class') el.className = String(v);
    else if (k === 'text') el.textContent = String(v);
    // A property, not an attribute: <textarea> ignores a value attribute.
    else if (k === 'value' && 'value' in el) (el as unknown as { value: string }).value = String(v);
    else if (k in el && typeof v !== 'string') (el as unknown as Record<string, unknown>)[k] = v;
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children) if (c !== null) el.append(c);
  return el;
}

export const bold = (text: string) => h('b', { text });

export function toggleFullscreen(): void {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.().catch(() => {});
}

/** Inputs where single-letter shortcuts must not fire. */
export const isTyping = (e: Event) => !!(e.target as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable]');

let wakeLock: WakeLockSentinel | null = null;
export async function acquireWakeLock(): Promise<void> {
  try { wakeLock = (await navigator.wakeLock?.request('screen')) ?? null; } catch { wakeLock = null; }
}
export function releaseWakeLock(): void { void wakeLock?.release().catch(() => {}); wakeLock = null; }

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Copy text to the clipboard; resolves false when the browser refuses. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Wire a button that copies `getText()` and briefly shows "Copied" (the
 * button's data-i18n label is restored afterwards).
 */
export function bindCopyButton(btn: HTMLButtonElement, getText: () => string, copiedLabel: () => string): void {
  let timer: number | undefined;
  btn.addEventListener('click', async () => {
    const text = getText();
    if (!text || !(await copyText(text))) return;
    const label = btn.querySelector<HTMLElement>('[data-label]') ?? btn;
    const original = label.textContent;
    label.textContent = copiedLabel();
    btn.classList.add('done');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => { label.textContent = original; btn.classList.remove('done'); }, 1400);
  });
}

/** Save text as a file in the user's downloads (nothing is uploaded). */
export function downloadText(filename: string, text: string, type = 'text/plain'): void {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const a = h('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Wire every `<button data-copy="element-id">` under `root`: it copies that
 * element's value (inputs, textareas) or text. Give the button a child with
 * `data-label` to have only that text swapped for "Copied".
 */
export function bindCopyTargets(root: ParentNode, copiedLabel: () => string): void {
  root.querySelectorAll<HTMLButtonElement>('button[data-copy]').forEach((btn) => {
    bindCopyButton(btn, () => {
      const el = document.getElementById(btn.dataset.copy!);
      if (!el) return '';
      return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el.value : el.textContent ?? '';
    }, copiedLabel);
  });
}
