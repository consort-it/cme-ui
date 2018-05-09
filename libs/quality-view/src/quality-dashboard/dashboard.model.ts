import { QualityDetail } from '@cme2/connector-quality';

export interface DashboardModel {
  healthIndex?: number;
  issueCount?: number;
  issueTooltip?: string;

  generatedAt: Date;

  ref?: string;

  details?: QualityDetail[];
}
