import HttpException from "./root";
import { HttpStatus } from "../enums";

export class NotFound extends HttpException {
	constructor(message: string, code: number, errors?: object) {
		super(message, code, HttpStatus.NOT_FOUND);
		if (errors) {
			this.errors = errors;
		}
	}
}
