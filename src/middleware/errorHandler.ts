import type { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";
import HttpException from "../exceptions/root";
import { ErrorCode, ErrorMessage } from "../enums";
import {
	InternalException,
	ValidationException,
} from "../exceptions/InternalException";

const errorHandler = (method: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await method(req, res, next);
		} catch (err: unknown) {
			let exception: HttpException;

			if (err instanceof mongoose.Error.ValidationError) {
				exception = new ValidationException(
					ErrorMessage.VALIDATION_ERROR,
					ErrorCode.VALIDATION_ERROR,
					err.errors,
				);
			} else if (err instanceof HttpException) {
				exception = err;
			} else {
				console.error("Unhandled error:", err);
				exception = new InternalException(
					ErrorMessage.SOMETHING_WENT_WRONG,
					ErrorCode.SOMETHING_WENT_WRONG,
					err as object,
				);
			}

			next(exception);
		}
	};
};

export default errorHandler;
