import { HttpStatus } from "@nestjs/common";
import { GenericError } from "../generic.error";

export class NotFoundError extends GenericError {
  constructor(code: string, message: string) {
    super(code, message, HttpStatus.NOT_FOUND);
  }
}
