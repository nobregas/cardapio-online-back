import type { Document } from "mongoose";
import type { IRestaurant } from "./restaurant.model";

import { model, Schema } from "mongoose";

export interface ICategory extends Document {
	name: string;
	description: string;
	order: number;
	image: string;
	restaurant: IRestaurant["_id"];
	isActive: boolean;
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
			required: false,
		},
		image: {
			type: String,
			trim: true,
			required: false,
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
	},
);

export default model<ICategory>("Category", categorySchema);
