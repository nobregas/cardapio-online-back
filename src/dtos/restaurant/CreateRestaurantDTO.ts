import type { PaymentSettingsDTO } from "./PaymentSettingsDTO";

export interface CreateRestaurantDTO {
	name: string;
	cnpj: string;
	logo: string;
	email: string;
	description: string;
	phone: string;
	address: CreateRestaurantAddressDTO;
	paymentSettings: PaymentSettingsDTO;
}

export interface CreateRestaurantAddressDTO {
	street: string;
	city: string;
	state: string;
	zipCode: string;
}
