import { fs, window } from '@tauri-apps/api';
import { TauriEvent } from '@tauri-apps/api/event';
import { Platform } from './platform';

const FILE_NAME = 'up-state.json';

export class TauriPlatform implements Platform {
  saveState(state: string): void {
    fs.writeFile(FILE_NAME, state);
  }

  async loadState(): Promise<string | undefined> {
    try {
      return await fs.readTextFile(FILE_NAME);
    } catch (e) {
      return undefined;
    }
  }

  onClose(callback: () => void): void {
    window.getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, callback);
  }
}