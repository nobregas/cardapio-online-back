import HttpException from "./root";
import { HttpStatus } from "../enums";

export class UnauthorizedException extends HttpException {
  constructor(message: string, code: number, errors?: object) {
    super(message, code, HttpStatus.UNAUTHORIZED);
    if (errors) {
      this.errors = errors;
    }
  }
}
