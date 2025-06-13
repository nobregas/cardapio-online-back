import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import errorHandler from "../middleware/errorHandler";

const categoryRoutes = Router();

// Rota para criar categoria
categoryRoutes.post("/create", errorHandler(CategoryController.create));

// Rota para buscar todas as categorias (sem /restaurant/)
categoryRoutes.get("/", errorHandler(CategoryController.getAll));

// Rota para buscar categoria por ID
categoryRoutes.get("/:id", errorHandler(CategoryController.getById));

// Rota para atualizar categoria (sem /update/)
categoryRoutes.patch("/:id", errorHandler(CategoryController.update));

// Rota para deletar categoria
categoryRoutes.delete("/:id", errorHandler(CategoryController.delete));

export default categoryRoutes;
