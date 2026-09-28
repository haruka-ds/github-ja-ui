import { loadEnabled, saveEnabled } from './settings';

const checkbox = document.querySelector<HTMLInputElement>('#enabled');
if (checkbox) {
  void loadEnabled().then((enabled) => {
    checkbox.checked = enabled;
  });
  checkbox.addEventListener('change', () => {
    void saveEnabled(checkbox.checked);
  });
}
