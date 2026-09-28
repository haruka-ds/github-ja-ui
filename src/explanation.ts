import type { Term } from './terminology';

export function explanation(term: Term): string | undefined {
  return term.description
    ? `${term.original} — ${term.description}`
    : undefined;
}
