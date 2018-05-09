/* tslint:disable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { HostnameService } from '@cme2/connector-base';
import { Observable } from 'rxjs/Observable';

import { AwsCosts } from '../model/awsCosts';
import { ErrorResponse } from '../model/errorResponse';
import { ResourceGroup } from '../model/resourceGroup';

import { COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class CostsService {
  private serviceBasePath = '/api/v1/aws-costs-adapter';
  private hostnameAndServiceBasePath = '';

  public defaultHeaders = new HttpHeaders();
  private configuration = new Configuration();

  constructor(protected httpClient: HttpClient, hostnameService: HostnameService) {
    hostnameService.getHostnameForClass('CostsService').subscribe(hostname => {
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
   * Get costs for AWS resources per month.
   * @param month Defines month to request costs for
   * @param year Defines the year of the month to request costs for.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getCosts(
    month: number,
    year: number,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<AwsCosts>;
  public getCosts(
    month: number,
    year: number,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<AwsCosts>>;
  public getCosts(
    month: number,
    year: number,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<AwsCosts>>;
  public getCosts(
    month: number,
    year: number,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (month === null || month === undefined) {
      throw new Error('Required parameter month was null or undefined when calling getCosts.');
    }
    if (year === null || year === undefined) {
      throw new Error('Required parameter year was null or undefined when calling getCosts.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (month !== undefined) {
      queryParameters = queryParameters.set('month', <any>month);
    }
    if (year !== undefined) {
      queryParameters = queryParameters.set('year', <any>year);
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

    return this.httpClient.get<AwsCosts>(`${this.hostnameAndServiceBasePath}/costs`, {
      params: queryParameters,
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   *
   * Get current available groups to calculate costs
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getResourceGroups(
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<ResourceGroup>;
  public getResourceGroups(
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<ResourceGroup>>;
  public getResourceGroups(
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<ResourceGroup>>;
  public getResourceGroups(
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.get<ResourceGroup>(`${this.hostnameAndServiceBasePath}/resource-groups`, {
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }
}
