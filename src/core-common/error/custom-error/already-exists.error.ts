import { HttpStatus } from "@nestjs/common";
import { GenericError } from "../generic.error";

/**
 * Custom error class for representing the scenario where an entity already exists/Conflict with existing.
 * Extends the GenericError class.
 */
export class AlreadyExistsError extends GenericError {
  /**
   * Constructor for the AlreadyExistsError class.
   * @param code - Short code associated with the error.
   * @param message - Detailed error information.
   */
  constructor(code: string, message: string) {
    super(code, message, HttpStatus.CONFLICT);
  }
}
