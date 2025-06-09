import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import errorHandler from "../middleware/errorHandler";
const authRoutes = Router();

authRoutes.post("/register", errorHandler(AuthController.register));
authRoutes.post("/login", errorHandler(AuthController.login));
authRoutes.post("/refresh-token", errorHandler(AuthController.refreshToken));
authRoutes.post("/logout", errorHandler(AuthController.logout));

export default authRoutes;
