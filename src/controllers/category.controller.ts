import type { NextFunction, Request, Response } from "express";
import type { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import type { UpdateCategoryDTO } from "../dtos/category/UpdateCategoryDTO";

import { HttpStatus } from "../enums";
import categoryService from "../services/category.service";

class CategoryController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const categoryData: CreateCategoryDTO = req.body;
			const userId = req.user?.id as string;

			const newCategory = await categoryService.create(categoryData, userId);
			res.status(HttpStatus.CREATED).json(newCategory);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user?.id as string;
			const categories = await categoryService.findAllByOwner(userId);
			res.status(HttpStatus.OK).json(categories);
		} catch (error) {
			next(error);
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userId = req.user?.id as string;
			const category = await categoryService.findById(id, userId);
			res.status(HttpStatus.OK).json(category);
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userId = req.user?.id as string;
			const updateData: UpdateCategoryDTO = req.body;

			const updatedCategory = await categoryService.update(
				id,
				userId,
				updateData,
			);
			res.status(HttpStatus.OK).json(updatedCategory);
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userId = req.user?.id as string;
			await categoryService.delete(id, userId);
			res.status(HttpStatus.NO_CONTENT).send();
		} catch (error) {
			next(error);
		}
	}
}

export default new CategoryController();
