/* tslint:disable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { HostnameService } from '@cme2/connector-base';
import { Observable } from 'rxjs/Observable';

import { ErrorResponse } from '../model/errorResponse';
import { Namespace } from '../model/namespace';
import { Pod } from '../model/pod';
import { Service } from '../model/service';

import { COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class KubernetesService {
  private serviceBasePath = '/api/v1/kubernetes-adapter';
  private hostnameAndServiceBasePath = '';

  public defaultHeaders = new HttpHeaders();
  private configuration = new Configuration();

  constructor(protected httpClient: HttpClient, hostnameService: HostnameService) {
    hostnameService.getHostnameForClass('KubernetesService').subscribe(hostname => {
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
   * Receive List of available Pod of namespace of kubernetes.
   * Internally connects to a Reader for Kubernetes Service and asks for list of Pod.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getNamespaces(
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<Namespace>>;
  public getNamespaces(
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Namespace>>>;
  public getNamespaces(
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Namespace>>>;
  public getNamespaces(
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.get<Array<Namespace>>(`${this.hostnameAndServiceBasePath}/namespaces`, {
      responseType: <any>responseType,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   * Receive List of available Pods for a specific service of kubernetes.
   * Internally connects to a Reader for Kubernetes Service and asks for list of PODs for a certain Service within a certain namespace.
   * @param namespaceId Namespace identifier
   * @param servicename Name of the service
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getPodsByService(
    namespaceId: string,
    servicename: string,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<Pod>>;
  public getPodsByService(
    namespaceId: string,
    servicename: string,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Pod>>>;
  public getPodsByService(
    namespaceId: string,
    servicename: string,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Pod>>>;
  public getPodsByService(
    namespaceId: string,
    servicename: string,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (namespaceId === null || namespaceId === undefined) {
      throw new Error('Required parameter namespaceId was null or undefined when calling getPodsByService.');
    }
    if (servicename === null || servicename === undefined) {
      throw new Error('Required parameter servicename was null or undefined when calling getPodsByService.');
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

    return this.httpClient.get<Array<Pod>>(
      `${this.hostnameAndServiceBasePath}/namespaces/${encodeURIComponent(
        String(namespaceId)
      )}/services/${encodeURIComponent(String(servicename))}/pods`,
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
   * Receive List of available Service of namespace of kubernetes.
   * Internally connects to a Reader for Kubernetes Service and asks for list of Service.
   * @param namespaceId Namespace identifier
   * @param servicename Name of the service
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getService(
    namespaceId: string,
    servicename: string,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Service>;
  public getService(
    namespaceId: string,
    servicename: string,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Service>>;
  public getService(
    namespaceId: string,
    servicename: string,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Service>>;
  public getService(
    namespaceId: string,
    servicename: string,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (namespaceId === null || namespaceId === undefined) {
      throw new Error('Required parameter namespaceId was null or undefined when calling getService.');
    }
    if (servicename === null || servicename === undefined) {
      throw new Error('Required parameter servicename was null or undefined when calling getService.');
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

    return this.httpClient.get<Service>(
      `${this.hostnameAndServiceBasePath}/namespaces/${encodeURIComponent(
        String(namespaceId)
      )}/services/${encodeURIComponent(String(servicename))}`,
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
   * Receive List of available Service of namespace of kubernetes.
   * Internally connects to a Reader for Kubernetes Service and asks for list of Service.
   * @param namespaceId Namespace identifier
   * @param listServiceNames List of commaseparated values with service names.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getServices(
    namespaceId: string,
    listServiceNames?: Array<string>,
    observe?: 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<Array<Service>>;
  public getServices(
    namespaceId: string,
    listServiceNames?: Array<string>,
    observe?: 'response',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Service>>>;
  public getServices(
    namespaceId: string,
    listServiceNames?: Array<string>,
    observe?: 'events',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Service>>>;
  public getServices(
    namespaceId: string,
    listServiceNames?: Array<string>,
    observe: any = 'body',
    responseType?: 'text' | 'json' | 'arraybuffer' | 'blob',
    reportProgress: boolean = false
  ): Observable<any> {
    if (namespaceId === null || namespaceId === undefined) {
      throw new Error('Required parameter namespaceId was null or undefined when calling getServices.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (listServiceNames) {
      queryParameters = queryParameters.set('listServiceNames', listServiceNames.join(COLLECTION_FORMATS['csv']));
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

    return this.httpClient.get<Array<Service>>(
      `${this.hostnameAndServiceBasePath}/namespaces/${encodeURIComponent(String(namespaceId))}/services`,
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
