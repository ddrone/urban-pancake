import { BrowserPlatform } from "./browser";
import { TauriPlatform } from "./tauri";

export interface Platform {
  loadState(): Promise<string|undefined>;
  saveState(state: string): void;
  onClose(callback: () => void): void;
  showError(msg: string): void;
  openFileDialog(): Promise<string|undefined>;
}

export const platform = '__TAURI__' in window ? new TauriPlatform() : new BrowserPlatform();
