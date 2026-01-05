import { GenericError } from "../error/generic.error";

export class Result<T> {
  success: boolean;
  data: T;
  error: GenericError;
  timestamp: string;

  public static success<T>(data: T): Result<T> {
    const result = new Result<T>();
    result.success = true;
    result.data = data;
    result.timestamp = new Date().toISOString();
    return result;
  }

  public static failed<T>(error: GenericError, data?: T): Result<T> {
    const result = new Result<T>();
    result.success = false;
    result.timestamp = new Date().toISOString();
    result.error = error;
    if (data) {
      result.data = data;
    }
    return result;
  }

  public static throwError<T>(error: GenericError, data?: T): Result<T> {
    const result = new Result<T>();
    result.success = false;
    result.timestamp = new Date().toISOString();
    result.error = error;
    if (data) {
      result.data = data;
    }
    throw result;
  }
}
