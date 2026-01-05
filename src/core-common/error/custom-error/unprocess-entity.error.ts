import { HttpStatus } from "@nestjs/common";
import { GenericError } from "../generic.error";

export class UnprocessableEntityError extends GenericError {
  constructor(code: string, message: string) {
    super(code, message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
