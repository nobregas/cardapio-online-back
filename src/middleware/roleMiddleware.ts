import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/UnauthorizedEXception";
import { ErrorCode, ErrorMessage } from "../enums";

const roleMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return next(
        new UnauthorizedException(
          ErrorMessage.UNAUTHORIZED,
          ErrorCode.UNAUTHORIZED
        )
      );
    }
    next();
  };
};

export default roleMiddleware;
