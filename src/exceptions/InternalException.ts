import HttpException from "./root";
import { HttpStatus } from "../enums";

export class InternalException extends HttpException {
	constructor(message: string, errorCode: number, errors?: object) {
		super(message, errorCode, HttpStatus.INTERNAL_SERVER_ERROR, errors);
	}
}

export class ValidationException extends HttpException {
	constructor(message: string, errorCode: number, errors?: object) {
		super(message, errorCode, HttpStatus.BAD_REQUEST, errors);
	}
}
