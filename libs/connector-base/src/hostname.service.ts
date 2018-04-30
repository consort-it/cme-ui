import { Injectable } from '@angular/core';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const KEY = 'cme2.mockUrls';

@Injectable()
export abstract class HostnameService {
  private _service2hostname: { [key: string]: string } = {};

  constructor(logger: LogService) {
    const parsed = localStorage.getItem(KEY);
    if (parsed) {
      this._service2hostname = JSON.parse(parsed);
      logger.warn(`HostnameService initialized with mocks (from localStorage):`, this._service2hostname);
    }
  }

  /**
   * Gets the current hostname for cluster connection.
   * Something like https://api.dev.k8s.company.com
   * (without slash)
   */
  abstract get hostname$(): Observable<string>;

  /**
   * Gets the hostname for the given REST Client class. Normally this is the hostname
   * of the current cluster connection unless otherwise specified in local storage key
   * cme.mockUrls.
   * @param className Complete name of REST Client class, e.g. JiraBackendService
   */
  getHostnameForClass(className: string): Observable<string> {
    const hostname: string | undefined = this._service2hostname[className];
    if (hostname) {
      return of(hostname);
    } else {
      return this.hostname$;
    }
  }
}
