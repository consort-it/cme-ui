import { Injectable } from '@angular/core';
import { CloudwatchLogsService } from '@cme2/connector-cloudwatch-logs';

@Injectable()
export class LogsService {
  constructor(private cloudwatchLogs: CloudwatchLogsService) {}

  public getLogsByMicroService(microserviceName: string) {
    return this.cloudwatchLogs.getLogsByMicroService(microserviceName);
  }
}
