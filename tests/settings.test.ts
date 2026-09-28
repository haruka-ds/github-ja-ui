import { expect, it, vi } from 'vitest';
import { loadEnabled, saveEnabled } from '../src/settings';

it('defaults ON and persists OFF', async () => {
  const store: Record<string, boolean> = {};
  vi.stubGlobal('chrome', {
    storage: {
      local: {
        get: vi.fn(async () => ({ ...store })),
        set: vi.fn(async (value: Record<string, boolean>) => {
          Object.assign(store, value);
        }),
      },
    },
  });
  expect(await loadEnabled()).toBe(true);
  await saveEnabled(false);
  expect(await loadEnabled()).toBe(false);
  vi.unstubAllGlobals();
});
