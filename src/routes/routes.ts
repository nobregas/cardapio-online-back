import { Router } from "express";
import authRoutes from "./auth.routes";
import ratelimiter from "../middleware/ratelimiter";
import restaurantRoutes from "./restaurant.routes";
import authMiddleware from "../middleware/authMIddleware";
import aiRoutes from "./ai.routes";
import categoryRoutes from "./caterogy.routes";

const ATTEMPTS = 9999;
const BLOCK_TIME = 10 * 60 * 1000;

const router = Router();

router.use("/auth", ratelimiter(ATTEMPTS, BLOCK_TIME), authRoutes);

router.use(
  "/restaurant",
  authMiddleware,
  ratelimiter(ATTEMPTS, BLOCK_TIME),
  restaurantRoutes
);

router.use(
  "/category",
  authMiddleware,
  ratelimiter(ATTEMPTS, BLOCK_TIME),
  categoryRoutes
);

router.use("/ai", authMiddleware, aiRoutes);

export default router;
