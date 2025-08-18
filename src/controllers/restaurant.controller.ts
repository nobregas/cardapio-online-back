import type { NextFunction, Request, Response } from "express";
import type { UpdatePaymentSettingsDTO } from "../dtos/restaurant/PaymentSettingsDTO";
import type { CreateRestaurantDTO } from "../dtos/restaurant/CreateRestaurantDTO";
import type { UpdateRestaurantDTO } from "../dtos/restaurant/UpdateRestaurant.DTO";

import { HttpStatus } from "../enums";
import restaurantService from "../services/restaurant.service";

class RestaurantController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const restaurantData: CreateRestaurantDTO = req.body;
			const ownerId = req.user?.id as string;
			const newRestaurant = await restaurantService.create(
				restaurantData,
				ownerId,
			);
			res.status(HttpStatus.CREATED).json(newRestaurant);
		} catch (error) {
			next(error);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const restaurants = await restaurantService.findAll();
			res.status(HttpStatus.OK).json(restaurants);
		} catch (error) {
			next(error);
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const restaurant = await restaurantService.findById(id);
			res.status(HttpStatus.OK).json(restaurant);
		} catch (error) {
			next(error);
		}
	}

	async getByOwnerId(req: Request, res: Response, next: NextFunction) {
		try {
			const ownerId = req.user?.id as string;
			const restaurants = await restaurantService.findByOwnerId(ownerId);
			res.status(HttpStatus.OK).json(restaurants);
		} catch (error) {
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const updateData: UpdateRestaurantDTO = req.body;
			const updatedRestaurant = await restaurantService.update(id, updateData);
			res.status(HttpStatus.OK).json(updatedRestaurant);
		} catch (error) {
			next(error);
		}
	}

	async updatePaymentSettings(req: Request, res: Response, next: NextFunction) {
		try {
			const ownerId = req.user?.id as string;
			const updateData: UpdatePaymentSettingsDTO = req.body;
			const updatedRestaurant = await restaurantService.updatePaymentSettings(
				updateData,
				ownerId,
			);
			res.status(HttpStatus.OK).json(updatedRestaurant);
		} catch (error) {
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await restaurantService.delete(id);
			res.status(HttpStatus.NO_CONTENT).send();
		} catch (error) {
			next(error);
		}
	}
}

export default new RestaurantController();
