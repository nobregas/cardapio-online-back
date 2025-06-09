import { Document, model, Schema } from "mongoose";
import { IRestaurant } from "./restaurant.model";

export interface ICategory extends Document {
  name: string;
  description: string;
  isActive: boolean;
  order: number;
  restaurant: IRestaurant["_id"];
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "O nome da categoria é obrigatório."],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A descrição da categoria é obrigatória."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "O restaurante é obrigatório."],
    },
  },
  {
    timestamps: true,
  }
);

export default model<ICategory>("Category", categorySchema);
