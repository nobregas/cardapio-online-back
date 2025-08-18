import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import errorHandler from "../middleware/errorHandler";

const categoryRoutes = Router();

categoryRoutes.post("/create", errorHandler(CategoryController.create));

categoryRoutes.get("/", errorHandler(CategoryController.getAll));

categoryRoutes.get("/:id", errorHandler(CategoryController.getById));

categoryRoutes.patch("/:id", errorHandler(CategoryController.update));

categoryRoutes.delete("/:id", errorHandler(CategoryController.delete));

export default categoryRoutes;
