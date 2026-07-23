import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude API client (server-only).
 *
 * Model: Claude Fable 5 — Anthropic's most capable model — with automatic
 * server-side fallback to Opus 4.8 on the rare safety-classifier refusal.
 * The API key comes from Secret Manager via apphosting.yaml (ANTHROPIC_API_KEY).
 */

export const claude = new Anthropic();

export const CLAUDE_MODEL = 'claude-fable-5';
export const FALLBACK_MODEL = 'claude-opus-4-8';
export const CLAUDE_BETAS = ['server-side-fallback-2026-06-01'];

/**
 * Extracts the JSON object from a model response, tolerating accidental
 * markdown fences or prose around it.
 */
export function extractJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('A resposta da IA não contém JSON válido.');
  }
  return JSON.parse(trimmed.slice(start, end + 1));
}
