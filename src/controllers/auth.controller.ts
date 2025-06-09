import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../enums";
import authService from "../services/auth.service";

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
    const user = req.user.id;
  }

  async refreshToken() {}

  async forgotPassword() {}
}

export default new AuthController();
