import { HttpStatus } from "@nestjs/common";
import { GenericError } from "../generic.error";

export class InternalServerError extends GenericError {
  constructor(
    code = "INTERNAL_SERVER_ERROR",
    message = "An unexpected error occurred",
  ) {
    super(code, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
