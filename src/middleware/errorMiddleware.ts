import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/root";

const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500; 
    
    res.status(statusCode).json({
        message: err.message || 'Internal server error',
        errorCode: err.errorCode || 500,
        errors: err.errors || {},
    });
};

export default errorMiddleware;
