export interface UpdateRestaurantDTO {
  name?: string;
  cnpj?: string;
  logo?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  description?: string;
  phone?: string;
}
