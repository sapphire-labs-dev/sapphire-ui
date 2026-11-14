// Test helpers for the sites (Node only, used from Vitest).

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Dict } from './i18n';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'node_modules' ? [] : sourceFiles(p);
    return /\.(ts|astro)$/.test(name) && !name.endsWith('.test.ts') ? [p] : [];
  });
}

/**
 * Every i18n key the code under `dir` asks for: t('key', …) calls, data-i18n*
 * attributes and *Key="…" props. Maps each key to a file that uses it.
 */
export function usedI18nKeys(dir: string): Map<string, string> {
  const used = new Map<string, string>();
  const patterns = [
    /\bt\(\s*'([a-z][\w.]*)'/g,
    /data-i18n(?:-placeholder|-title)?="([a-z][\w.]*)"/g,
    /\b\w*[kK]ey="([a-z][\w.]*)"/g,
    /\bkey: '([a-z][\w.]*)'/g,
  ];
  for (const file of sourceFiles(dir)) {
    const text = readFileSync(file, 'utf8');
    for (const re of patterns) for (const m of text.matchAll(re)) used.set(m[1], file);
  }
  return used;
}

/** Problems in a dictionary: missing keys, empty strings, mismatched {placeholders}, keys used but undefined. */
export function translationProblems(dict: Dict, used: Map<string, string> = new Map()): string[] {
  const problems: string[] = [];
  const en = Object.keys(dict.en);
  const pt = Object.keys(dict.pt);
  for (const k of en) if (!(k in dict.pt)) problems.push(`missing pt: ${k}`);
  for (const k of pt) if (!(k in dict.en)) problems.push(`missing en: ${k}`);
  for (const lang of ['en', 'pt'] as const) {
    for (const [k, v] of Object.entries(dict[lang])) if (!v.trim()) problems.push(`empty ${lang}: ${k}`);
  }
  const vars = (s = '') => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join();
  for (const k of en) if (vars(dict.en[k]) !== vars(dict.pt[k])) problems.push(`placeholders differ: ${k}`);
  for (const [k, file] of used) if (!(k in dict.en)) problems.push(`undefined key: ${k} (${file})`);
  return problems;
}
