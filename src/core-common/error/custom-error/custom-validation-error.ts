import { BadRequestError } from "./bad-request.error";

export class CustomValidationError extends BadRequestError {
  constructor(
    public validationErrors: any
  ) {
    super("ValidationError", "There are issues found in the input provided.");
  }
}
