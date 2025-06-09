import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../enums";
import authService from "../services/auth.service";
import { UnauthorizedException } from "../exceptions/UnauthorizedEXception";
import { ErrorCode, ErrorMessage } from "../enums";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await authService.register(req.body);

      res.status(HttpStatus.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await authService.login(req.body);
      res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const userID = req.user?.id;
    try {
      if (!userID) {
        throw new UnauthorizedException(
          ErrorMessage.MISSING_OR_INVALID_TOKEN,
          ErrorCode.MISSING_OR_INVALID_TOKEN
        );
      }
      await authService.logout(userID as string);
      res.status(HttpStatus.OK).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await authService.refreshToken(req.user?.id as string);
      res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword() {}
}

export default new AuthController();
