// Karma configuration file for PACT

const pactServices = [
  {
    cors: true,
    port: 10001,
    consumer: 'cme-ui',
    provider: 'metadata-service',
    dir: 'pacts',
    spec: 2
  },
  {
    cors: true,
    port: 10002,
    consumer: 'cme-ui',
    provider: 'cloudwatch-logs-adapter',
    dir: 'pacts',
    spec: 2
  },
  {
    cors: true,
    port: 10003,
    consumer: 'cme-ui',
    provider: 'kubernetes-adapter',
    dir: 'pacts',
    spec: 2
  },
  {
    cors: true,
    port: 10004,
    consumer: 'cme-ui',
    provider: 'jira-adapter',
    dir: 'pacts',
    spec: 2
  },
  {
    cors: true,
    port: 10005,
    consumer: 'cme-ui',
    provider: 'quality-adapter',
    dir: 'pacts',
    spec: 2
  }
];

module.exports = function(config) {
  config.set({
    pact: pactServices,
    basePath: '',
    frameworks: ['jasmine', '@angular/cli', 'pact'],
    plugins: [
      require('karma-jasmine'),
      require('@pact-foundation/karma-pact'),
      require('karma-chrome-launcher'),
      require('@angular/cli/plugins/karma')
    ],
    client: {
      args: [pactServices],
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
