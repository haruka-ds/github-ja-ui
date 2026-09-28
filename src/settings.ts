export const settingKey = 'enabled';

export async function loadEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get(settingKey);
  return result[settingKey] !== false;
}

export async function saveEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({ [settingKey]: enabled });
}
