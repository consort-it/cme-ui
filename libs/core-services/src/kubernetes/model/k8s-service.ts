import { K8sServiceStatus } from './k8s-service-status.enum';

export interface K8sService {
  /**
   * service name. This is a unique value, like an ID. It has the form 'service-name' or 'service-adapter'
   */
  name: string;
  /**
   * version/tag of service container image.
   */
  version: string | undefined;
  /**
   * Is the service running or something else?
   */
  status: K8sServiceStatus;
  /**
   * The number of service instances on kubernetes
   */
  instances: number;

  /**
   * A human readable message with some information about the current status.
   */
  reason?: string;
}
