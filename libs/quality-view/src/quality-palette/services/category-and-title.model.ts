import { QualityStatus } from '@cme2/connector-quality';

export interface CategoryAndTitle {
  category: QualityStatus.CategoryEnum;

  /**
   * This is a translation key, not the actual translation.
   */
  titleKey: string;
}
