import { Result } from "../result-model/result";

/**
 * Standard response object to be returned to the caller of the API.
 * This class represents the structure of a success response returned by the API.
 * @typeparam T - The type of data included in the response.
 */
export class GenericSuccessResponse<T> {
  statusCode: number;
  success: boolean;
  data: T;
  timestamp: string;

  /**
   * Sets the properties from the Result object.
   * @param result - Result object instance returned from the controller method.
   * @param statusCode - HTTP status code.
   */
  initialize(result: Result<T>, statusCode: number) {
    this.statusCode = statusCode;
    this.success = result.success;
    this.data = result.data;
    this.timestamp = new Date().toISOString();
  }
}
