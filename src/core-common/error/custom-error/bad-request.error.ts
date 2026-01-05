import { HttpStatus } from "@nestjs/common";
import { GenericError } from "../generic.error";

export class BadRequestError extends GenericError {
  constructor(code: string, message: string) {
    super(code, message, HttpStatus.BAD_REQUEST);
  }
}
