import { Router } from "express";
import AiController from "../controllers/ai.controller";
import errorHandler from "../middleware/errorHandler";

const aiRoutes = Router();

aiRoutes.post("/generate", errorHandler(AiController.generate));

export default aiRoutes;
