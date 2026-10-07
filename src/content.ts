import { TranslationEngine } from './engine';
import { observeUi } from './observer';
import { loadEnabled, settingKey } from './settings';

const engine = new TranslationEngine();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes[settingKey]) return;
  const enabled = changes[settingKey].newValue !== false;
  engine.setEnabled(enabled);
  if (enabled) engine.scan(document.documentElement);
});

void loadEnabled().then((enabled) => {
  engine.setEnabled(enabled);
  observeUi(engine);
});

for (const event of ['turbo:load', 'turbo:render', 'pjax:end']) {
  document.addEventListener(event, () => engine.scan(document.documentElement));
}
window.addEventListener('popstate', () =>
  engine.scan(document.documentElement),
);
