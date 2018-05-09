import { MetadataServiceType } from './meta-data-service-type.enum';

export interface MetadataService {
  name: string;
  description?: string;
  /**
   * A string describing the icon of the service in google material icon font (https://material.io/icons)
   */
  icon?: string;
  serviceType: MetadataServiceType;
  url?: string;

  messageQueue?: string;
  /**
   * Other microservice to whom content is provided
   */
  dependencies?: string;
  /**
   * Name of the persisten storage where data is collected from
   */
  persistence?: string;
}
