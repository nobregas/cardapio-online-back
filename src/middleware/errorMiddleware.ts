import type { NextFunction, Request, Response } from "express";
import type HttpException from "../exceptions/root";

const errorMiddleware = (
	err: HttpException,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		message: err.message || "Internal server error",
		errorCode: err.errorCode || 500,
		errors: err.errors || {},
	});
};

export default errorMiddleware;
