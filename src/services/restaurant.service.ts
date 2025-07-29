import { CreateRestaurantDTO } from "../dtos/restaurant/CreateRestaurantDTO";
import { UpdatePaymentSettingsDTO } from "../dtos/restaurant/PaymentSettingsDTO";
import {
  UpdateRestaurantAddressDTO,
  UpdateRestaurantDTO,
} from "../dtos/restaurant/UpdateRestaurant.DTO";
import { ErrorMessage, ErrorCode } from "../enums";
import { BadRequest } from "../exceptions/BadRequest";
import { NotFound } from "../exceptions/NotFound";
import { IRestaurant } from "../models/restaurant.model";
import Restaurant from "../models/restaurant.model";

class RestaurantService {
  async create(
    restaurantData: CreateRestaurantDTO,
    ownerId: string
  ): Promise<IRestaurant> {
    const { cnpj, email } = restaurantData;
    const existingRestaurant = await Restaurant.findOne({
      $or: [{ cnpj }, { email }],
    });

    if (existingRestaurant) {
      throw new BadRequest(
        ErrorMessage.RESTAURANT_ALREADY_EXISTS,
        ErrorCode.RESTAURANT_ALREADY_EXISTS
      );
    }

    const dataWithOwner = { ...restaurantData, ownerId };
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
        ErrorCode.RESTAURANT_NOT_FOUND
      );
    }

    return restaurant;
  }

  async findByOwnerId(ownerId: string): Promise<IRestaurant> {
    const restaurant = await Restaurant.findOne({ ownerId });
    if (!restaurant) {
      throw new NotFound(
        ErrorMessage.RESTAURANT_NOT_FOUND,
        ErrorCode.RESTAURANT_NOT_FOUND
      );
    }

    return restaurant;
  }

  async update(
    id: string,
    restaurantData: UpdateRestaurantDTO
  ): Promise<IRestaurant> {
    const updateRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      restaurantData,
      { new: true, runValidators: true }
    );
    if (!updateRestaurant) {
      throw new NotFound(
        ErrorMessage.RESTAURANT_NOT_FOUND,
        ErrorCode.RESTAURANT_NOT_FOUND
      );
    }

    return updateRestaurant;
  }

  async updateAddress(
    id: string,
    addressData: UpdateRestaurantAddressDTO
  ): Promise<IRestaurant> {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: { address: addressData } },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      throw new NotFound(
        ErrorMessage.RESTAURANT_NOT_FOUND,
        ErrorCode.RESTAURANT_NOT_FOUND
      );
    }

    return updatedRestaurant;
  }

  async updatePaymentSettings(
    paymentSettingsData: UpdatePaymentSettingsDTO,
    ownerId: string
  ): Promise<IRestaurant> {
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { ownerId },
      { $set: { paymentSettings: paymentSettingsData } },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      throw new NotFound(
        ErrorMessage.RESTAURANT_NOT_FOUND,
        ErrorCode.RESTAURANT_NOT_FOUND
      );
    }

    return updatedRestaurant;
  }

  async delete(id: string): Promise<void> {
    const deleteRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!deleteRestaurant) {
      throw new NotFound(
        ErrorMessage.RESTAURANT_NOT_FOUND,
        ErrorCode.RESTAURANT_NOT_FOUND
      );
    }
  }
}

export default new RestaurantService();
