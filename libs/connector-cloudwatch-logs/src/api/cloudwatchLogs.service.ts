/* tslint:disable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { HostnameService } from '@cme2/connector-base';
import { Observable } from 'rxjs/Observable';

import { ErrorResponse } from '../model/errorResponse';
import { Group } from '../model/group';
import { LogEntry } from '../model/logEntry';
import { Logs } from '../model/logs';
import { Stream } from '../model/stream';

import { COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class CloudwatchLogsService {
  private serviceBasePath = '/api/v1/cloudwatch-logs-adapter';
  private hostnameAndServiceBasePath = '';

  public defaultHeaders = new HttpHeaders();
  private configuration = new Configuration();

  constructor(protected httpClient: HttpClient, hostnameService: HostnameService) {
    hostnameService.getHostnameForClass('CloudwatchLogsService').subscribe(hostname => {
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
   * Receive a single LogGroup with metadata identified by Name given.
   * This URI serves a sinle available LogGroup from AWS CloudWatch.
   * @param gid Group identifier
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getGroupByID(gid: string, observe?: 'body', reportProgress?: boolean): Observable<Group>;
  public getGroupByID(gid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Group>>;
  public getGroupByID(gid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Group>>;
  public getGroupByID(gid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (gid === null || gid === undefined) {
      throw new Error('Required parameter gid was null or undefined when calling getGroupByID.');
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

    return this.httpClient.get<Group>(`${this.hostnameAndServiceBasePath}/groups/${encodeURIComponent(String(gid))}`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * Receive List of available LogGroups with metadata.
   * This URI serves all available LogGroups in AWS CloudWatch. Each LogGroup contains a set of information except LogStream details.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getGroups(observe?: 'body', reportProgress?: boolean): Observable<Array<Group>>;
  public getGroups(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Group>>>;
  public getGroups(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Group>>>;
  public getGroups(observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.get<Array<Group>>(`${this.hostnameAndServiceBasePath}/groups`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * Send your microservice name as partial of LogStream name and receive the most recent log file entries - default limit 20 log file entries.
   * Send your microservice name and receive the most recent log file entries.
   * @param microserviceName Name of microservice which logs must be served
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getLogsByMicroService(
    microserviceName: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<LogEntry>>;
  public getLogsByMicroService(
    microserviceName: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<LogEntry>>>;
  public getLogsByMicroService(
    microserviceName: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<LogEntry>>>;
  public getLogsByMicroService(
    microserviceName: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (microserviceName === null || microserviceName === undefined) {
      throw new Error('Required parameter microserviceName was null or undefined when calling getLogsByMicroService.');
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

    return this.httpClient.get<Array<LogEntry>>(
      `${this.hostnameAndServiceBasePath}/${encodeURIComponent(String(microserviceName))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Receive all Logs of LogStream identifiable by name.
   * Serves Logs of LogStream matching name available from AWS CloudWatch.
   * @param sid Stream identifier
   * @param limit Logs Limit configuration
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getLogsByStreamID(
    sid: string,
    limit?: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<Logs>>;
  public getLogsByStreamID(
    sid: string,
    limit?: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Logs>>>;
  public getLogsByStreamID(
    sid: string,
    limit?: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Logs>>>;
  public getLogsByStreamID(
    sid: string,
    limit?: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (sid === null || sid === undefined) {
      throw new Error('Required parameter sid was null or undefined when calling getLogsByStreamID.');
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

    return this.httpClient.get<Array<Logs>>(
      `${this.hostnameAndServiceBasePath}/streams/${encodeURIComponent(String(sid))}/logs`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Receive Logs of LogStream withing LogGroup.
   * Serves Logs of Logstream identified by name within LogGroup identified by name with optionaly limit
   * @param gid Group identifier
   * @param sid Stream identifier
   * @param limit Logs Limit configuration
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getLogsByStreamIDByGroupID(
    gid: string,
    sid: string,
    limit?: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<LogEntry>>;
  public getLogsByStreamIDByGroupID(
    gid: string,
    sid: string,
    limit?: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<LogEntry>>>;
  public getLogsByStreamIDByGroupID(
    gid: string,
    sid: string,
    limit?: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<LogEntry>>>;
  public getLogsByStreamIDByGroupID(
    gid: string,
    sid: string,
    limit?: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (gid === null || gid === undefined) {
      throw new Error('Required parameter gid was null or undefined when calling getLogsByStreamIDByGroupID.');
    }
    if (sid === null || sid === undefined) {
      throw new Error('Required parameter sid was null or undefined when calling getLogsByStreamIDByGroupID.');
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

    return this.httpClient.get<Array<LogEntry>>(
      `${this.hostnameAndServiceBasePath}/groups/${encodeURIComponent(String(gid))}/streams/${encodeURIComponent(
        String(sid)
      )}/logs`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Receive all LogGroups that contain given name.
   * Serves LogGroups matching name available from AWS CloudWatch.
   * @param partial Partial identification for Group
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getSearchedGroupsByPartialID(
    partial: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<Group>>;
  public getSearchedGroupsByPartialID(
    partial: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Group>>>;
  public getSearchedGroupsByPartialID(
    partial: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Group>>>;
  public getSearchedGroupsByPartialID(
    partial: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (partial === null || partial === undefined) {
      throw new Error('Required parameter partial was null or undefined when calling getSearchedGroupsByPartialID.');
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

    return this.httpClient.get<Array<Group>>(
      `${this.hostnameAndServiceBasePath}/search/groups/${encodeURIComponent(String(partial))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Receive all LogStreams that contain given name.
   * Serves LogStreams matching name available from AWS CloudWatch.
   * @param partial Partial identification for Stream
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getSearchedStreamsByPartialID(
    partial: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<Stream>>;
  public getSearchedStreamsByPartialID(
    partial: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Stream>>>;
  public getSearchedStreamsByPartialID(
    partial: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Stream>>>;
  public getSearchedStreamsByPartialID(
    partial: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (partial === null || partial === undefined) {
      throw new Error('Required parameter partial was null or undefined when calling getSearchedStreamsByPartialID.');
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

    return this.httpClient.get<Array<Stream>>(
      `${this.hostnameAndServiceBasePath}/search/streams/${encodeURIComponent(String(partial))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Receive a single LogStream with metadata identified by Name and a LogGroup name given.
   * This URI serves a single available LogStream from within the LogGroup that is identified by name and available from AWS CloudWatch.
   * @param gid Group identifier
   * @param sid Stream identifier
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getStreamByIDByGroupID(gid: string, sid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public getStreamByIDByGroupID(
    gid: string,
    sid: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public getStreamByIDByGroupID(
    gid: string,
    sid: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public getStreamByIDByGroupID(
    gid: string,
    sid: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (gid === null || gid === undefined) {
      throw new Error('Required parameter gid was null or undefined when calling getStreamByIDByGroupID.');
    }
    if (sid === null || sid === undefined) {
      throw new Error('Required parameter sid was null or undefined when calling getStreamByIDByGroupID.');
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

    return this.httpClient.get<any>(
      `${this.hostnameAndServiceBasePath}/groups/${encodeURIComponent(String(gid))}/streams/${encodeURIComponent(
        String(sid)
      )}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Receive List of available LogStreams with metadata of given LogGroup name.
   * This URI serves all available LogStreams of an available LogGroups in AWS CloudWatch. Each LogStream contains a set of information except LogStream details.
   * @param gid Group identifier
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getStreamsByGroupID(gid: string, observe?: 'body', reportProgress?: boolean): Observable<Array<Stream>>;
  public getStreamsByGroupID(
    gid: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Stream>>>;
  public getStreamsByGroupID(
    gid: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Stream>>>;
  public getStreamsByGroupID(gid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (gid === null || gid === undefined) {
      throw new Error('Required parameter gid was null or undefined when calling getStreamsByGroupID.');
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

    return this.httpClient.get<Array<Stream>>(
      `${this.hostnameAndServiceBasePath}/groups/${encodeURIComponent(String(gid))}/streams`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Receive all LogStreams identifiable by name.
   * Serves LogStreams matching name available from AWS CloudWatch.
   * @param sid Stream identifier
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getStreamsByID(sid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public getStreamsByID(sid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public getStreamsByID(sid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public getStreamsByID(sid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (sid === null || sid === undefined) {
      throw new Error('Required parameter sid was null or undefined when calling getStreamsByID.');
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

    return this.httpClient.get<any>(`${this.hostnameAndServiceBasePath}/streams/${encodeURIComponent(String(sid))}`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }
}
