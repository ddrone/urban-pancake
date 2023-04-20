import { Platform } from "./platform";

const LS_KEY = 'state';

export class BrowserPlatform implements Platform {
  saveState(state: string): void {
    window.localStorage.setItem(LS_KEY, state);
  }

  async loadState(): Promise<string | undefined> {
    const result = window.localStorage.getItem(LS_KEY);

    return result ?? undefined;
  }

  onClose(callback: () => void): void {
    window.addEventListener('unload', callback);
  }

  showError(msg: string): void {
    console.error(msg);
  }

  async openFileDialog(): Promise<string | undefined> {
    console.error('openFileDialog is not available in web shell');
    return undefined;
  }

  openFile(name: string) {
    console.error(`Trying to open file ${name}`);
  }
}
