export interface CreateRestaurantDTO {
  name: string;
  cnpj: string;
  logo: string;
  email: string;
  description: string;
  phone: string;
  address: CreateRestaurantAddressDTO;
}

export interface CreateRestaurantAddressDTO {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
