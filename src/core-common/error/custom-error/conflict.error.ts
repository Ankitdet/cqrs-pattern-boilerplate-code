import { HttpStatus } from "@nestjs/common";
import { GenericError } from "../generic.error";

/**
 * Custom error class for representing conflict errors.
 * Extends the GenericError class.
 */
export class ConflictError extends GenericError {
  /**
   * Constructor for the ConflictError class.
   * @param code - Short code associated with the error.
   * @param message - Detailed error information.
   */
  constructor(code: string, message: string) {
    super(code, message, HttpStatus.CONFLICT);
  }
}
