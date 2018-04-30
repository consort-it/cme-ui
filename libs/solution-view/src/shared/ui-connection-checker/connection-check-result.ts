export interface ConnectionCheckResult {
  statusCode: number;

  responseTime: number;

  isError: boolean;

  url: string;

  reason?: string;

  version?: string;
}
