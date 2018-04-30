import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class LocalStorageService extends StorageService {
  clear(): void {
    localStorage.clear();
  }
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
  key(index: number): string | null {
    return localStorage.key(index);
  }
  removeItem(key: string): void {
    return localStorage.removeItem(key);
  }
  setItem(key: string, data: string): void {
    localStorage.setItem(key, data);
  }
}
