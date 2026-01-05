import { Result } from "../result-model/result";

/**
 * Standard error response to be returned to the caller of the API.
 * This class represents the structure of an error response returned by the API
 * in case of failures.
 */

export class ErrorDisplay {
  code: string;
  message: string;
  validationError?: any;
}
export class GenericErrorResponse {
  statusCode: number;
  success: boolean = false;
  error: ErrorDisplay;
  timestamp: string;
  data: any;

  constructor() {
    this.statusCode = 500; // Default value
    this.success = false;
    this.timestamp = new Date().toISOString(); // Default value
  }
  /**
   * Sets the properties from the Result object.
   * @param result - Result object instance returned from the controller method.
   * @param statusCode - HTTP status code.
   */
  initialize(
    result: Result<any>,
    statusCode: number,
  ) {
    this.statusCode = statusCode;
    this.error = {
      code: result.error?.code || "ERROR",
      message: result.error?.message || "An error occurred.",
    };
    this.data = result.data
    this.success = result.success || false;
    this.timestamp = result.timestamp || new Date().toISOString();
  }
}
