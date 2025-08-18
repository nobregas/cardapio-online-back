import type { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import type { UpdateCategoryDTO } from "../dtos/category/UpdateCategoryDTO";

import { ErrorCode, ErrorMessage } from "../enums";
import { BadRequest } from "../exceptions/BadRequest";
import { NotFound } from "../exceptions/NotFound";
import Category, { type ICategory } from "../models/category.model";
import {
	createCategorySchema,
	updateCategorySchema,
} from "../schemas/category/category.schema";
import restaurantService from "./restaurant.service";

class CategoryService {
	async create(
		createCategoryDTO: CreateCategoryDTO,
		userId: string,
	): Promise<ICategory> {
		const validatedCategoryData = createCategorySchema.parse(createCategoryDTO);

		const restaurant = await restaurantService.findByOwnerId(userId);

		const existingCategory = await Category.findOne({
			name: validatedCategoryData.name,
			restaurant: restaurant._id,
		});
		if (existingCategory) {
			throw new BadRequest(
				ErrorMessage.CATEGORY_ALREADY_EXISTS,
				ErrorCode.CATEGORY_ALREADY_EXISTS,
			);
		}

		const categoryToCreate = {
			...validatedCategoryData,
			restaurant: restaurant._id,
		};
		const newCategory = await Category.create(categoryToCreate);
		return newCategory;
	}

	async findAllByOwner(userId: string): Promise<ICategory[]> {
		const restaurant = await restaurantService.findByOwnerId(userId);
		const categories = await Category.find({ restaurant: restaurant._id });
		return categories;
	}

	async findById(id: string, userId: string): Promise<ICategory> {
		const restaurant = await restaurantService.findByOwnerId(userId);
		const category = await Category.findOne({
			_id: id,
			restaurant: restaurant._id,
		});

		if (!category) {
			throw new NotFound(
				ErrorMessage.CATEGORY_NOT_FOUND,
				ErrorCode.CATEGORY_NOT_FOUND,
			);
		}
		return category;
	}

	async update(
		id: string,
		userId: string,
		categoryData: UpdateCategoryDTO,
	): Promise<ICategory> {
		const validatedCategoryData = updateCategorySchema.parse(categoryData);
		const restaurant = await restaurantService.findByOwnerId(userId);

		if (validatedCategoryData.name) {
			const existingCategory = await Category.findOne({
				name: validatedCategoryData.name,
				restaurant: restaurant._id,
				_id: { $ne: id },
			});
			if (existingCategory) {
				throw new BadRequest(
					ErrorMessage.CATEGORY_ALREADY_EXISTS,
					ErrorCode.CATEGORY_ALREADY_EXISTS,
				);
			}
		}

		const updatedCategory = await Category.findOneAndUpdate(
			{ _id: id, restaurant: restaurant._id },
			validatedCategoryData,
			{
				new: true,
				runValidators: true,
			},
		);

		if (!updatedCategory) {
			throw new NotFound(
				ErrorMessage.CATEGORY_NOT_FOUND,
				ErrorCode.CATEGORY_NOT_FOUND,
			);
		}

		return updatedCategory;
	}

	async delete(id: string, userId: string): Promise<void> {
		const restaurant = await restaurantService.findByOwnerId(userId);
		const deletedCategory = await Category.findOneAndDelete({
			_id: id,
			restaurant: restaurant._id,
		});

		if (!deletedCategory) {
			throw new NotFound(
				ErrorMessage.CATEGORY_NOT_FOUND,
				ErrorCode.CATEGORY_NOT_FOUND,
			);
		}
	}
}

export default new CategoryService();
