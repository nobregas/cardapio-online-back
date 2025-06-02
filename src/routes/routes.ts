import { Router } from "express";
import authRoutes from "./auth.routes";
import ratelimiter from "../middleware/ratelimiter";

const ATTEMPTS = 5;
const BLOCK_TIME = 10 * 60 * 1000;

const router = Router();

router.use("/auth", ratelimiter(ATTEMPTS, BLOCK_TIME), authRoutes);


export default router;