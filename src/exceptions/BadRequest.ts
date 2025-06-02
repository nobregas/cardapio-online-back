import HttpException from "./root";
import { HttpStatus } from "../enums";

export class BadRequest extends HttpException {
    constructor(message: string, code: number, errors?: object) {
        super(message, code, HttpStatus.BAD_REQUEST);
        if (errors) {
            this.errors = errors;
        }
    }
}