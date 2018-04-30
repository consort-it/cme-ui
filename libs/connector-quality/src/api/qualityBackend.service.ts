
/* tslint:disable member-ordering */



import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { HostnameService }                                   from '@cme2/connector-base';
import { Observable }                                        from 'rxjs/Observable';

import { ErrorResponse } from '../model/errorResponse';
import { QualityIndex } from '../model/qualityIndex';
import { QualityStatus } from '../model/qualityStatus';

import { COLLECTION_FORMATS }                                from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class QualityBackendService {
    private serviceBasePath = '/api/v1/quality-adapter';
    private hostnameAndServiceBasePath = '';

    public defaultHeaders = new HttpHeaders();
    private configuration = new Configuration();

    constructor(protected httpClient: HttpClient, hostnameService: HostnameService) {
        hostnameService.getHostnameForClass('QualityBackendService').subscribe(hostname => {
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
     * Get the calculated quality index according to the magic formula
     * @param microservices 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getQualityIndex(microservices: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<QualityIndex>;
    public getQualityIndex(microservices: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<QualityIndex>>;
    public getQualityIndex(microservices: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<QualityIndex>>;
    public getQualityIndex(microservices: Array<string>, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (microservices === null || microservices === undefined) {
            throw new Error('Required parameter microservices was null or undefined when calling getQualityIndex.');
        }

        let headers = this.defaultHeaders;


        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<QualityIndex>(`${this.hostnameAndServiceBasePath}/qualityIndex/${encodeURIComponent(String(microservices))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Get Quality Gate Information for each Microservice
     * @param microservices 
     * @param category 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getQualityStatusForCategory(microservices: Array<string>, category: 'CodeQuality' | 'Builds' | 'Contracts' | 'Vulnerabilities' | 'Bugs' | 'SmokeTests' | 'End2End' | 'Logs', observe?: 'body', reportProgress?: boolean): Observable<QualityStatus>;
    public getQualityStatusForCategory(microservices: Array<string>, category: 'CodeQuality' | 'Builds' | 'Contracts' | 'Vulnerabilities' | 'Bugs' | 'SmokeTests' | 'End2End' | 'Logs', observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<QualityStatus>>;
    public getQualityStatusForCategory(microservices: Array<string>, category: 'CodeQuality' | 'Builds' | 'Contracts' | 'Vulnerabilities' | 'Bugs' | 'SmokeTests' | 'End2End' | 'Logs', observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<QualityStatus>>;
    public getQualityStatusForCategory(microservices: Array<string>, category: 'CodeQuality' | 'Builds' | 'Contracts' | 'Vulnerabilities' | 'Bugs' | 'SmokeTests' | 'End2End' | 'Logs', observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (microservices === null || microservices === undefined) {
            throw new Error('Required parameter microservices was null or undefined when calling getQualityStatusForCategory.');
        }
        if (category === null || category === undefined) {
            throw new Error('Required parameter category was null or undefined when calling getQualityStatusForCategory.');
        }

        let headers = this.defaultHeaders;


        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<QualityStatus>(`${this.hostnameAndServiceBasePath}/status/${encodeURIComponent(String(category))}/${encodeURIComponent(String(microservices))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
