/* tslint:disable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { HostnameService } from '@cme2/connector-base';
import { Observable } from 'rxjs/Observable';

import { Environment } from '../model/environment';
import { ErrorResponse } from '../model/errorResponse';

import { COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class FeatureToggleBackendService {
  private serviceBasePath = '/api/v1/feature-toggle-service';
  private hostnameAndServiceBasePath = '';

  public defaultHeaders = new HttpHeaders();
  private configuration = new Configuration();

  constructor(protected httpClient: HttpClient, hostnameService: HostnameService) {
    hostnameService.getHostnameForClass('FeatureToggleBackendService').subscribe(hostname => {
      this.hostnameAndServiceBasePath = `${hostname}${this.serviceBasePath}`;
    });
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the environments with feature toggles for the given microservice.
   *
   * @param serviceName the microservice name (simple format, without &#39;-vX&#39; suffix)
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getFeatureToggles(
    serviceName: string,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<Environment>>;
  public getFeatureToggles(
    serviceName: string,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Environment>>>;
  public getFeatureToggles(
    serviceName: string,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Environment>>>;
  public getFeatureToggles(
    serviceName: string,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (serviceName === null || serviceName === undefined) {
      throw new Error('Required parameter serviceName was null or undefined when calling getFeatureToggles.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.get<Array<Environment>>(
      `${this.hostnameAndServiceBasePath}/stages/all/services/${encodeURIComponent(String(serviceName))}`,
      {
        responseType: <any>responseType,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Sets a new value for a feature toggle in a specific environment.
   *
   * @param envName the name of the stage in whicht the microservice resides where the feature should be toggled
   * @param serviceName the name of the microservice including the part with the version number
   * @param toggleName the name of the feature to be toggled
   * @param value value the feature toggle should be set to
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public setFeatureToggle(
    envName: string,
    serviceName: string,
    toggleName: string,
    value: boolean,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<Environment>>;
  public setFeatureToggle(
    envName: string,
    serviceName: string,
    toggleName: string,
    value: boolean,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Environment>>>;
  public setFeatureToggle(
    envName: string,
    serviceName: string,
    toggleName: string,
    value: boolean,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Environment>>>;
  public setFeatureToggle(
    envName: string,
    serviceName: string,
    toggleName: string,
    value: boolean,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (envName === null || envName === undefined) {
      throw new Error('Required parameter envName was null or undefined when calling setFeatureToggle.');
    }
    if (serviceName === null || serviceName === undefined) {
      throw new Error('Required parameter serviceName was null or undefined when calling setFeatureToggle.');
    }
    if (toggleName === null || toggleName === undefined) {
      throw new Error('Required parameter toggleName was null or undefined when calling setFeatureToggle.');
    }
    if (value === null || value === undefined) {
      throw new Error('Required parameter value was null or undefined when calling setFeatureToggle.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.put<Array<Environment>>(
      `${this.hostnameAndServiceBasePath}/stages/${encodeURIComponent(String(envName))}/services/${encodeURIComponent(
        String(serviceName)
      )}/features/${encodeURIComponent(String(toggleName))}`,
      value,
      {
        responseType: <any>responseType,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
