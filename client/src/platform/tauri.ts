import { fs, path, window, notification, dialog } from '@tauri-apps/api';
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
    window.getCurrent().onCloseRequested((event) => {
      callback();
      event.preventDefault();
      window.getCurrent().hide();
    })
  }

  showError(msg: string): void {
    notification.sendNotification({
      title: 'Runtime error',
      body: msg
    })
  }

  async openFileDialog(): Promise<string | undefined> {
    const result = await dialog.open({
      multiple: false
    });

    if (typeof result === 'string') {
      return result;
    }
    return undefined;
  }
}