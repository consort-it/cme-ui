export interface ClusterConnection {
  /**
   * Internal ID for identifying the objects. Will be auto-generated on creation.
   */
  id: string;

  /**
   * The hostname or IP of the Kubernetes Cluster. Must include the protocol (e.g. https://dev.k8s.aws.com).
   */
  hostname: string;

  /**
   * The kubernetes namespace.
   */
  namespace: string;

  /**
   * The "friendly" name for this connection (will be displayed in UI, e.g. "Testing Environment Engineering Department").
   */
  environment: string;
}
