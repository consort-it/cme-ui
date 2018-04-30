import { Injectable } from '@angular/core';

/**
 * Simple wrapper around http fetch api. Useful when testing...
 */
@Injectable()
export class FetchService {
  /**
   * Simply proxies to http fetch method
   */
  fetch(url: string | Request, init?: RequestInit): Promise<Response> {
    return fetch(url, init);
  }
}
