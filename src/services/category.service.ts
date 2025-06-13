import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { UpdateCategoryDTO } from "../dtos/category/UpdateCategoryDTO";
import { ErrorCode, ErrorMessage } from "../enums";
import { BadRequest } from "../exceptions/BadRequest";
import { NotFound } from "../exceptions/NotFound";
import Category, { ICategory } from "../models/category.model";
import restaurantService from "./restaurant.service";

class CategoryService {
  async create(
    createCategoryDTO: CreateCategoryDTO,
    userId: string
  ): Promise<ICategory> {
    const { name } = createCategoryDTO;
    const restaurant = await restaurantService.findByOwnerId(userId);

    const existingCategory = await Category.findOne({
      name,
      restaurant: restaurant._id,
    });
    if (existingCategory) {
      throw new BadRequest(
        ErrorMessage.CATEGORY_ALREADY_EXISTS,
        ErrorCode.CATEGORY_ALREADY_EXISTS
      );
    }

    const categoryToCreate = {
      ...createCategoryDTO,
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
        ErrorCode.CATEGORY_NOT_FOUND
      );
    }
    return category;
  }

  async update(
    id: string,
    userId: string,
    categoryData: UpdateCategoryDTO
  ): Promise<ICategory> {
    const restaurant = await restaurantService.findByOwnerId(userId);

    if (categoryData.name) {
      const existingCategory = await Category.findOne({
        name: categoryData.name,
        restaurant: restaurant._id,
        _id: { $ne: id },
      });
      if (existingCategory) {
        throw new BadRequest(
          ErrorMessage.CATEGORY_ALREADY_EXISTS,
          ErrorCode.CATEGORY_ALREADY_EXISTS
        );
      }
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, restaurant: restaurant._id },
      categoryData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      throw new NotFound(
        ErrorMessage.CATEGORY_NOT_FOUND,
        ErrorCode.CATEGORY_NOT_FOUND
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
        ErrorCode.CATEGORY_NOT_FOUND
      );
    }
  }
}

export default new CategoryService();
