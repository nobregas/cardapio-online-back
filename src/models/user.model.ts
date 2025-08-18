import type { Document } from "mongoose";
import type { IRestaurant } from "./restaurant.model";

import { Schema, model } from "mongoose";
import { UserRole } from "./enums/roles";

export interface IUser extends Document {
	email: string;
	password: string;
	role: UserRole;
	name: string;
	refreshToken?: string;
	phone?: string;
	restaurant?: IRestaurant["_id"];
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: [true, "O email é obrigatório."],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/\S+@\S+\.\S+/, "Por favor, insira um endereço de email válido."],
		},
		password: {
			type: String,
			required: [true, "A senha é obrigatória."],
			minlength: [8, "A senha deve ter pelo menos 8 caracteres."],
		},
		role: {
			type: String,
			enum: Object.values(UserRole),
			required: [true, "O cargo (role) é obrigatório."],
			default: UserRole.EMPLOYEE,
		},
		name: {
			type: String,
			trim: true,
		},
		phone: {
			type: String,
			trim: true,
			match: [
				/^\d{2}9\d{8}$/,
				"Por favor, insira um número de telefone válido.",
			],
		},
		restaurant: {
			type: Schema.Types.ObjectId,
			ref: "Restaurant",
			default: null,
			required: false,
		},
		refreshToken: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password")) return next();
});

export default model<IUser>("User", userSchema);
