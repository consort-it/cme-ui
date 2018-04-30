/* tslint:disable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { HostnameService } from '@cme2/connector-base';
import { Observable } from 'rxjs/Observable';

import { ErrorResponse } from '../model/errorResponse';
import { JiraIssue } from '../model/jiraIssue';

import { COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class JiraBackendService {
  private serviceBasePath = '/api/v1/jira-adapter';
  private hostnameAndServiceBasePath = '';

  public defaultHeaders = new HttpHeaders();
  private configuration = new Configuration();

  constructor(protected httpClient: HttpClient, hostnameService: HostnameService) {
    hostnameService.getHostnameForClass('JiraBackendService').subscribe(hostname => {
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
   *
   * Returns a list of Jira Issues, depending on the given \&quot;tag\&quot; parameter
   * @param tag The tag of the Jira issue
   * @param status Return only issues with this status. If parameter is not set, return issues !&#x3D; &#39;Closed&#39;.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getIssues(
    tag: string,
    status?: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<JiraIssue>>;
  public getIssues(
    tag: string,
    status?: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<JiraIssue>>>;
  public getIssues(
    tag: string,
    status?: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<JiraIssue>>>;
  public getIssues(
    tag: string,
    status?: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (tag === null || tag === undefined) {
      throw new Error('Required parameter tag was null or undefined when calling getIssues.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (tag !== undefined) {
      queryParameters = queryParameters.set('tag', <any>tag);
    }
    if (status !== undefined) {
      queryParameters = queryParameters.set('status', <any>status);
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

    return this.httpClient.get<Array<JiraIssue>>(`${this.hostnameAndServiceBasePath}/issues`, {
      params: queryParameters,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }
}
