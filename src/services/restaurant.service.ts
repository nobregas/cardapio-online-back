import type { CreateRestaurantDTO } from "../dtos/restaurant/CreateRestaurantDTO";
import type { UpdatePaymentSettingsDTO } from "../dtos/restaurant/PaymentSettingsDTO";
import type {
	UpdateRestaurantAddressDTO,
	UpdateRestaurantDTO,
} from "../dtos/restaurant/UpdateRestaurant.DTO";
import type { IRestaurant } from "../models/restaurant.model";

import { ErrorMessage, ErrorCode } from "../enums";
import { BadRequest } from "../exceptions/BadRequest";
import { NotFound } from "../exceptions/NotFound";
import Restaurant from "../models/restaurant.model";
import {
	createRestaurantSchema,
	updateAddressSchema,
	updatePaymentSettingsSchema,
	updateRestaurantSchema,
} from "../schemas/restaurant/restaurant.schema";

class RestaurantService {
	async create(
		restaurantData: CreateRestaurantDTO,
		ownerId: string,
	): Promise<IRestaurant> {
		const validatedRestaurantData =
			createRestaurantSchema.parse(restaurantData);

		const existingRestaurant = await Restaurant.findOne({
			$or: [
				{ cnpj: validatedRestaurantData.cnpj },
				{ email: validatedRestaurantData.email },
			],
		});

		if (existingRestaurant) {
			throw new BadRequest(
				ErrorMessage.RESTAURANT_ALREADY_EXISTS,
				ErrorCode.RESTAURANT_ALREADY_EXISTS,
			);
		}

		const dataWithOwner = { ...validatedRestaurantData, ownerId };
		const restaurant = await Restaurant.create(dataWithOwner);
		return restaurant;
	}

	async findAll(): Promise<IRestaurant[]> {
		const restaurant = await Restaurant.find();
		return restaurant;
	}

	async findById(id: string): Promise<IRestaurant> {
		const restaurant = await Restaurant.findById(id);
		if (!restaurant) {
			throw new NotFound(
				ErrorMessage.RESTAURANT_NOT_FOUND,
				ErrorCode.RESTAURANT_NOT_FOUND,
			);
		}

		return restaurant;
	}

	async findByOwnerId(ownerId: string): Promise<IRestaurant> {
		const restaurant = await Restaurant.findOne({ ownerId });
		if (!restaurant) {
			throw new NotFound(
				ErrorMessage.RESTAURANT_NOT_FOUND,
				ErrorCode.RESTAURANT_NOT_FOUND,
			);
		}

		return restaurant;
	}

	async update(
		id: string,
		restaurantData: UpdateRestaurantDTO,
	): Promise<IRestaurant> {
		const validatedRestaurantData =
			updateRestaurantSchema.parse(restaurantData);

		const updateRestaurant = await Restaurant.findByIdAndUpdate(
			id,
			validatedRestaurantData,
			{ new: true, runValidators: true },
		);
		if (!updateRestaurant) {
			throw new NotFound(
				ErrorMessage.RESTAURANT_NOT_FOUND,
				ErrorCode.RESTAURANT_NOT_FOUND,
			);
		}

		return updateRestaurant;
	}

	async updateAddress(
		id: string,
		addressData: UpdateRestaurantAddressDTO,
	): Promise<IRestaurant> {
		const validatedAddressData = updateAddressSchema.parse(addressData);

		const updatedRestaurant = await Restaurant.findByIdAndUpdate(
			id,
			{ $set: { address: validatedAddressData } },
			{ new: true, runValidators: true },
		);

		if (!updatedRestaurant) {
			throw new NotFound(
				ErrorMessage.RESTAURANT_NOT_FOUND,
				ErrorCode.RESTAURANT_NOT_FOUND,
			);
		}

		return updatedRestaurant;
	}

	async updatePaymentSettings(
		paymentSettingsData: UpdatePaymentSettingsDTO,
		ownerId: string,
	): Promise<IRestaurant> {
		const validatedPaymentdata =
			updatePaymentSettingsSchema.parse(paymentSettingsData);

		const updatedRestaurant = await Restaurant.findOneAndUpdate(
			{ ownerId },
			{ $set: { paymentSettings: validatedPaymentdata } },
			{ new: true, runValidators: true },
		);

		if (!updatedRestaurant) {
			throw new NotFound(
				ErrorMessage.RESTAURANT_NOT_FOUND,
				ErrorCode.RESTAURANT_NOT_FOUND,
			);
		}

		return updatedRestaurant;
	}

	async delete(id: string): Promise<void> {
		const deleteRestaurant = await Restaurant.findByIdAndDelete(id);
		if (!deleteRestaurant) {
			throw new NotFound(
				ErrorMessage.RESTAURANT_NOT_FOUND,
				ErrorCode.RESTAURANT_NOT_FOUND,
			);
		}
	}
}

export default new RestaurantService();
