import { Router } from "express";
import AiController from "../controllers/ai.controller";
import errorHandler from "../middleware/errorHandler";
import ratelimiter from "../middleware/ratelimiter";

const ATTEMPTS = 9999;
const BLOCK_TIME = 10 * 60 * 1000;

const aiRoutes = Router();

aiRoutes.post(
  "/generate",
  ratelimiter(ATTEMPTS, BLOCK_TIME),
  errorHandler(AiController.generate)
);

export default aiRoutes;
