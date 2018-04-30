export interface ConnectionCheckResult {
  status: 'OK' | 'ERROR';
  message: string;
  hostname: string;
}
