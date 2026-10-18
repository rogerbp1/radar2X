import fs from 'fs';
import path from 'path';

const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');

/**
 * Reads an API key from process.env or directly from .env.local on disk
 * so hot changes to .env.local take effect immediately without server restarts.
 */
export function getEnvKey(
  keyName: 'OPENROUTER_API_KEY' | 'YOUTUBE_API_KEY' | 'TAVILY_API_KEY'
): string {
  const fromProcess = process.env[keyName]?.trim();
  if (fromProcess) return fromProcess;

  try {
    if (!fs.existsSync(ENV_LOCAL_PATH)) return '';
    const content = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (k === keyName && v) {
        process.env[keyName] = v;
        return v;
      }
    }
  } catch {
    // Ignore read errors
  }

  return '';
}
