export interface UpdateRestaurantAddressDTO {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UpdateRestaurantDTO {
  name?: string;
  logo?: string;
  description?: string;
  phone?: string;
  address?: UpdateRestaurantAddressDTO;
}
