import { ServiceState } from '../solution-microservice';

export interface ServiceModel {
  name: string;
  description?: string;
  version?: string;
  serviceState: ServiceState;
  selected: boolean;
  icon?: string;
}
