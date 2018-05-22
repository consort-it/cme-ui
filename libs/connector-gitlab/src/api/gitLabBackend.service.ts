/* tslint:disable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { HostnameService } from '@cme2/connector-base';
import { Observable } from 'rxjs/Observable';

import { CommitMetadata } from '../model/commitMetadata';
import { ErrorResponse } from '../model/errorResponse';

import { COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class GitLabBackendService {
  private serviceBasePath = '/api/v1/gitlab-adapter';
  private hostnameAndServiceBasePath = '';

  public defaultHeaders = new HttpHeaders();
  private configuration = new Configuration();

  constructor(protected httpClient: HttpClient, hostnameService: HostnameService) {
    hostnameService.getHostnameForClass('GitLabBackendService').subscribe(hostname => {
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
   * Get the raw content of the specified file
   * Querying this path the service returns the raw file defined by the filepath.
   * @param microserviceName The name of the project/microservice for which to get the file
   * @param filepath Defines which file to get. Whole path is necessary if file is inside directories.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getFileAsRaw(
    microserviceName: string,
    filepath: string,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Blob>;
  public getFileAsRaw(
    microserviceName: string,
    filepath: string,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Blob>>;
  public getFileAsRaw(
    microserviceName: string,
    filepath: string,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Blob>>;
  public getFileAsRaw(
    microserviceName: string,
    filepath: string,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (microserviceName === null || microserviceName === undefined) {
      throw new Error('Required parameter microserviceName was null or undefined when calling getFileAsRaw.');
    }
    if (filepath === null || filepath === undefined) {
      throw new Error('Required parameter filepath was null or undefined when calling getFileAsRaw.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.get(
      `${this.hostnameAndServiceBasePath}/${encodeURIComponent(
        String(microserviceName)
      )}/content-as-raw/${encodeURIComponent(String(filepath))}`,
      {
        responseType: 'blob',
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Get the raw content of the specified file
   * Querying this path the service returns the raw file defined by the filepath. If the file is found on many servers, then an array of raw files is returned.
   * @param microserviceName The name of the project/microservice for which to get the file
   * @param filepath Defines which file to get. Whole path is necessary if file is inside directories.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getFileAsString(
    microserviceName: string,
    filepath: string,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<string>;
  public getFileAsString(
    microserviceName: string,
    filepath: string,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<string>>;
  public getFileAsString(
    microserviceName: string,
    filepath: string,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<string>>;
  public getFileAsString(
    microserviceName: string,
    filepath: string,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (microserviceName === null || microserviceName === undefined) {
      throw new Error('Required parameter microserviceName was null or undefined when calling getFileAsString.');
    }
    if (filepath === null || filepath === undefined) {
      throw new Error('Required parameter filepath was null or undefined when calling getFileAsString.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['text/plain', 'application/json'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.get<string>(
      `${this.hostnameAndServiceBasePath}/${encodeURIComponent(
        String(microserviceName)
      )}/content-as-string/${encodeURIComponent(String(filepath))}`,
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
   * Get the metadata about the last commits (default: 5 commits)
   * Returns the metadata for the specified repository.
   * @param microserviceName The name of the project/microservice for which to get the file
   * @param limit Limit the number of returned commits (default: 5)
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getMetadata(
    microserviceName: string,
    limit?: number,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<CommitMetadata>>;
  public getMetadata(
    microserviceName: string,
    limit?: number,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<CommitMetadata>>>;
  public getMetadata(
    microserviceName: string,
    limit?: number,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<CommitMetadata>>>;
  public getMetadata(
    microserviceName: string,
    limit?: number,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (microserviceName === null || microserviceName === undefined) {
      throw new Error('Required parameter microserviceName was null or undefined when calling getMetadata.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (limit !== undefined) {
      queryParameters = queryParameters.set('limit', <any>limit);
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

    return this.httpClient.get<Array<CommitMetadata>>(
      `${this.hostnameAndServiceBasePath}/${encodeURIComponent(String(microserviceName))}/metadata`,
      {
        params: queryParameters,
        responseType: <any>responseType,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Get the metadata about the last 5 commits for the specified file
   * Returns the metadata for the specified file. The metadata contains information from the last commit made to this file.
   * @param microserviceName The name of the project/microservice for which to get the file
   * @param filepath Defines which file to get. Whole path is necessary if file is inside directories.
   * @param limit Limit the number of commits returned (default: 5)
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getMetadataForFile(
    microserviceName: string,
    filepath: string,
    limit?: number,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<CommitMetadata>>;
  public getMetadataForFile(
    microserviceName: string,
    filepath: string,
    limit?: number,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<CommitMetadata>>>;
  public getMetadataForFile(
    microserviceName: string,
    filepath: string,
    limit?: number,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<CommitMetadata>>>;
  public getMetadataForFile(
    microserviceName: string,
    filepath: string,
    limit?: number,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (microserviceName === null || microserviceName === undefined) {
      throw new Error('Required parameter microserviceName was null or undefined when calling getMetadataForFile.');
    }
    if (filepath === null || filepath === undefined) {
      throw new Error('Required parameter filepath was null or undefined when calling getMetadataForFile.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (limit !== undefined) {
      queryParameters = queryParameters.set('limit', <any>limit);
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

    return this.httpClient.get<Array<CommitMetadata>>(
      `${this.hostnameAndServiceBasePath}/${encodeURIComponent(String(microserviceName))}/metadata/${encodeURIComponent(
        String(filepath)
      )}`,
      {
        params: queryParameters,
        responseType: <any>responseType,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }
}
