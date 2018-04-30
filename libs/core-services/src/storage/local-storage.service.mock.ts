import { StorageService } from './storage.service';

/**
 * In-Memory version of localStorage. Use for tests...
 */
export class LocalStorageMockService extends StorageService {
  private storage: any = {};

  get length(): number {
    return Object.keys(this.storage).length;
  }

  clear(): void {
    this.storage = {};
  }

  getItem(key: string): string | null {
    return key in this.storage ? this.storage[key] : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.storage);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.storage[key];
  }

  setItem(key: string, data: string): void {
    this.storage[key] = data;
  }
}
