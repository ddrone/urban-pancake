import { fs, path, window } from '@tauri-apps/api';
import { Platform } from './platform';

const FILE_NAME = 'up-state.json';

export class TauriPlatform implements Platform {
  path: string|undefined;

  saveState(state: string): void {
    if (this.path === undefined) {
      return;
    }

    console.log(`Trying to save to path ${this.path}`);
    fs.writeFile(this.path, state);
  }

  async loadState(): Promise<string | undefined> {
    if (this.path === undefined) {
      this.path = await path.join(await path.appDataDir(), FILE_NAME);
    }

    try {
      return await fs.readTextFile(this.path);
    } catch (e) {
      return undefined;
    }
  }

  onClose(callback: () => void): void {
    window.getCurrent().onCloseRequested(() => {
      callback();
    })
  }
}