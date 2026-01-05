import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Custom error class which needs to be returned from the lower layers to the higher calling layers
 */
export class GenericError {
  @ApiProperty({ description: "Short error code" })
  public code: string;

  @ApiProperty({ description: "Detailed error description" })
  public message: string;

  @ApiProperty({ description: "Detailed error description" })
  public statusCode: HttpStatus;

  /**
   * Default constructor
   * @param code - Short error code  e.g. "InvaliOperation", "ItemNotFound" etc
   * @param message  - Detailed error message
   */
  constructor(
    code: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
  }
}
