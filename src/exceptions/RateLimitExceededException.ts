import HttpException from "./root";
import { ErrorCode, HttpStatus, ErrorMessage } from "../enums";

export default class RateLimitExceededException extends HttpException {
  constructor() {
    super(
      ErrorMessage.RATE_LIMIT_EXCEEDED,
      ErrorCode.RATE_LIMIT_EXCEEDED,
      HttpStatus.RATE_LIMIT_EXCEEDED,
      undefined
    );
  }
}
