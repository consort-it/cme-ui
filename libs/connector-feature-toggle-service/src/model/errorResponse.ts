/**
 * feature-toggle-service
 * The feature toggle service manages feature toggle settings for the microservices in different environments. It can read the current settings as well as change them.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: manuel.hiemer@consort-it.de
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { TracePoint } from './tracePoint';

export interface ErrorResponse {
  /**
   * This error code should have the format 'FTS-XXX' where XXX is an integer. It is used to uniquely distinguish different error cases in order to display a suitable and translatable error message on the UI.
   */
  code: string;
  /**
   * Represents the http status error that goes along with this error.
   */
  status: number;
  /**
   * Should contain a short, meaningful description of the error case. Might be displayed to the end user.
   */
  message: string;
  /**
   * Contains a trace of errors if available. Only use for forwarding to developer. In case this is missing as it is optional use location to identify where error happened originally.
   */
  trace?: Array<TracePoint>;
  /**
   * Field that indicates where the error occured. This is a mandatory field and should be considered in case trace is not available.
   */
  location: string;
  /**
   * The exact time the error occured within microservice.
   */
  time: string;
}
