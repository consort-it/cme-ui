/* tslint:disable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { HostnameService } from '@cme2/connector-base';
import { Observable } from 'rxjs/Observable';

import { DomainModel } from '../model/domainModel';
import { ErrorResponse } from '../model/errorResponse';

import { COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class DomainModelBackendService {
  private serviceBasePath = '/api/v1/domain-model-service';
  private hostnameAndServiceBasePath = '';

  public defaultHeaders = new HttpHeaders();
  private configuration = new Configuration();

  constructor(protected httpClient: HttpClient, hostnameService: HostnameService) {
    hostnameService.getHostnameForClass('DomainModelBackendService').subscribe(hostname => {
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
   * Get the model objects defined in the swagger-files of the relevant services
   *
   * @param serviceNames The names of the services whose objects are requested
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getModelsForServices(
    serviceNames: Array<string>,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<DomainModel>>;
  public getModelsForServices(
    serviceNames: Array<string>,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<DomainModel>>>;
  public getModelsForServices(
    serviceNames: Array<string>,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<DomainModel>>>;
  public getModelsForServices(
    serviceNames: Array<string>,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (serviceNames === null || serviceNames === undefined) {
      throw new Error('Required parameter serviceNames was null or undefined when calling getModelsForServices.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (serviceNames) {
      queryParameters = queryParameters.set('serviceNames', serviceNames.join(COLLECTION_FORMATS['csv']));
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

    return this.httpClient.get<Array<DomainModel>>(`${this.hostnameAndServiceBasePath}/services`, {
      params: queryParameters,
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * Saves the appreance data of the model objects (headerColor, iconName, positionX, positionY). If any of the other properties of the model are changed, this will be ignored.
   *
   * @param serviceNames The names of the services whose objects are requested
   * @param models Model objects
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public saveModelAppearance(
    serviceNames: Array<string>,
    models: Array<DomainModel>,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<DomainModel>>;
  public saveModelAppearance(
    serviceNames: Array<string>,
    models: Array<DomainModel>,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<DomainModel>>>;
  public saveModelAppearance(
    serviceNames: Array<string>,
    models: Array<DomainModel>,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<DomainModel>>>;
  public saveModelAppearance(
    serviceNames: Array<string>,
    models: Array<DomainModel>,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (serviceNames === null || serviceNames === undefined) {
      throw new Error('Required parameter serviceNames was null or undefined when calling saveModelAppearance.');
    }
    if (models === null || models === undefined) {
      throw new Error('Required parameter models was null or undefined when calling saveModelAppearance.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (serviceNames) {
      queryParameters = queryParameters.set('serviceNames', serviceNames.join(COLLECTION_FORMATS['csv']));
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

    return this.httpClient.put<Array<DomainModel>>(`${this.hostnameAndServiceBasePath}/services`, models, {
      params: queryParameters,
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }
}
