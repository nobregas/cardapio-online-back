import { Request, Response, NextFunction } from "express";
import { ErrorCode, ErrorMessage } from "../enums";
import { UnauthorizedException } from "../exceptions/UnauthorizedEXception";
import * as jwt from "jsonwebtoken";
import { IDecodedToken } from "../types";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new UnauthorizedException(
        ErrorMessage.MISSING_OR_INVALID_TOKEN,
        ErrorCode.MISSING_OR_INVALID_TOKEN
      )
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as IDecodedToken;

    if (!payload?.id) {
      return next(
        new UnauthorizedException(
          ErrorMessage.MISSING_OR_INVALID_TOKEN,
          ErrorCode.MISSING_OR_INVALID_TOKEN
        )
      );
    }

    const user = await User.findById(payload.id);

    if (!user) {
      return next(
        new UnauthorizedException(
          ErrorMessage.USER_NOT_FOUND,
          ErrorCode.USER_NOT_FOUND
        )
      );
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(
        new UnauthorizedException(
          ErrorMessage.TOKEN_EXPIRED,
          ErrorCode.TOKEN_EXPIRED
        )
      );
    }

    return next(
      new UnauthorizedException(
        ErrorMessage.MISSING_OR_INVALID_TOKEN,
        ErrorCode.MISSING_OR_INVALID_TOKEN
      )
    );
  }
};

export default authMiddleware;
