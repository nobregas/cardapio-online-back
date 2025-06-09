import { Document, model, Schema } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  cnpj?: string;
  logo?: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  description: string;
  phone: string;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "O nome do restaurante é obrigatório."],
    },
    cnpj: {
      type: String,
      trim: true,
      required: [true, "O CNPJ do restaurante é obrigatório."],
    },
    logo: {
      type: String,
      trim: true,
      required: [true, "O logo do restaurante é obrigatório."],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "O email do restaurante é obrigatório."],
    },
    address: {
      street: {
        type: String,
        trim: true,
        required: [true, "A rua do restaurante é obrigatória."],
      },
      city: {
        type: String,
        trim: true,
        required: [true, "A cidade do restaurante é obrigatória."],
      },
      state: {
        type: String,
        trim: true,
        required: [true, "O estado do restaurante é obrigatório."],
      },
      zipCode: {
        type: String,
        trim: true,
        required: [true, "O CEP do restaurante é obrigatório."],
      },
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "O telefone do restaurante é obrigatório."],
    },
  },
  {
    timestamps: true,
  }
);

export default model<IRestaurant>("Restaurant", restaurantSchema);
