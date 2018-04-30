import { HttpClientModule } from '@angular/common/http';
import { NgModule, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PactWeb } from '@pact-foundation/pact-web';
import { of } from 'rxjs/observable/of';

// HostnameService is deep-imported to avoid a dependency to the whole connector-base lib
import { HostnameService } from '../../connector-base/src/hostname.service'; // tslint:disable-line
import { Observable } from 'rxjs/Observable';
import { MockLogService } from '../../logging/src/logging/mock-log.service'; // tslint:disable-line

/**
 * __karma__.config.args[0] contains all pactServices as defined in karma-pact.conf.js
 */
declare const __karma__: { config: { args: [Array<{ provider: string; port: number }>] } };

const getPactServiceConfiguration = (providerName: string): { provider: string; port: number } | undefined =>
  __karma__.config.args[0].find(item => item.provider === providerName);

class PactHostnameService extends HostnameService {
  hostname$: Observable<string>;

  constructor(port: number) {
    super(new MockLogService());
    this.hostname$ = of(`http://127.0.0.1:${port}`);
  }
}

/**
 * Create a group of pact specs (often called a suite).
 * @param description Textual description of the group (should be the provider name)
 * @param providerName Name of the REST service providing the API under test
 * @param specDefinitions Function for Jasmine to invoke that will define inner suites a specs
 */
const _describePact = (
  describeFunctionToBeUsed: (_description: string, _specDefinitions: () => void) => void,
  description: string,
  providerName: string,
  specDefinitions: (provider: PactWeb, pactTestModule: Type<any>) => void
): void => {
  const serviceConfig = getPactServiceConfiguration(providerName);
  if (!serviceConfig) {
    throw new Error(
      `No Pact service provider configuration found for ${providerName}. Did you forget to add a new service provider to pactServices in karma-pact.conf.js?`
    );
  }

  @NgModule({
    imports: [HttpClientModule],
    providers: [{ provide: HostnameService, useValue: new PactHostnameService(serviceConfig.port) }]
  })
  class PactTestModule {}

  const describe = describeFunctionToBeUsed;
  describe(description, () => {
    const provider = new PactWeb({
      consumer: 'cme-ui',
      provider: serviceConfig.provider,
      port: serviceConfig.port,
      host: '127.0.0.1'
    });

    beforeAll((done: DoneFn) => {
      setTimeout(done, 2000); // required for slower CI environments
      provider.removeInteractions(); // Required if run with `singleRun: false`
    });

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PactTestModule]
      });
    });

    afterEach((done: DoneFn) => {
      provider.verify().then(done, e => done.fail(e));
    });

    afterAll((done: DoneFn) => {
      provider.finalize().then(
        function() {
          done();
        },
        function(err) {
          done.fail(err);
        }
      );
    });

    specDefinitions(provider, PactTestModule);
  });
};

export const describePact = (
  description: string,
  providerName: string,
  specDefinitions: (provider: PactWeb, pactTestModule: Type<any>) => void
) => {
  _describePact(describe, description, providerName, specDefinitions);
};

export const fdescribePact = (
  description: string,
  providerName: string,
  specDefinitions: (provider: PactWeb, pactTestModule: Type<any>) => void
) => {
  _describePact(fdescribe, description, providerName, specDefinitions);
};

export const xdescribePact = (
  description: string,
  providerName: string,
  specDefinitions: (provider: PactWeb, pactTestModule: Type<any>) => void
) => {
  _describePact(xdescribe, description, providerName, specDefinitions);
};
