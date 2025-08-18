import type { RegisterDTO } from "../dtos/auth/RegisterDTO";
import type { LoginDTO } from "../dtos/auth/LoginDTO";
import type { JWTPayload } from "./jwt.service";

import * as bcrypt from "bcryptjs";
import { ErrorCode, ErrorMessage } from "../enums";
import { BadRequest } from "../exceptions/BadRequest";
import User from "../models/user.model";
import { UserRole } from "../models/enums/roles";
import { InternalException } from "../exceptions/InternalException";
import jwtService from "./jwt.service";
import { loginSchema, registerSchema } from "../schemas/auth/auth.schema";

class AuthService {
	async login(credentials: LoginDTO): Promise<{ token: string }> {
		const validatedCredentials = loginSchema.parse(credentials);

		const user = await User.findOne({ email: validatedCredentials.email });
		if (!user) {
			throw new BadRequest(ErrorMessage.INVALID_LOGIN, ErrorCode.INVALID_LOGIN);
		}

		const isPasswordValid = await bcrypt.compare(
			validatedCredentials.password,
			user.password,
		);
		if (!isPasswordValid) {
			throw new BadRequest(ErrorMessage.INVALID_LOGIN, ErrorCode.INVALID_LOGIN);
		}

		const payload: JWTPayload = { id: user._id };
		const token = jwtService.generateToken(payload);
		const refreshToken = jwtService.generateRefreshToken(payload);

		user.refreshToken = refreshToken;

		await user.save();

		return { token: token };
	}

	async register(userData: RegisterDTO) {
		const userValidatedData = registerSchema.parse(userData);

		const existingUser = await User.findOne({ email: userValidatedData.email });
		if (existingUser) {
			throw new BadRequest(
				ErrorMessage.USER_ALREADY_EXISTS,
				ErrorCode.USER_ALREADY_EXISTS,
			);
		}

		const hashedPassword = await bcrypt.hash(userValidatedData.password, 10);
		const newUser = await User.create({
			name: userValidatedData.name,
			email: userValidatedData.email,
			password: hashedPassword,
			phone: userValidatedData.phone,
			role: UserRole.CUSTOMER,
		});

		const { password: _, ...userWithoutPassword } = newUser.toObject();
		return userWithoutPassword;
	}

	async register_owner(userData: RegisterDTO) {
		const userValidatedData = registerSchema.parse(userData);

		const existingUser = await User.findOne({ email: userValidatedData.email });
		if (existingUser) {
			throw new BadRequest(
				ErrorMessage.USER_ALREADY_EXISTS,
				ErrorCode.USER_ALREADY_EXISTS,
			);
		}

		const hashedPassword = await bcrypt.hash(userValidatedData.password, 10);
		const newUser = await User.create({
			name: userValidatedData.name,
			email: userValidatedData.email,
			password: hashedPassword,
			phone: userValidatedData.phone,
			role: UserRole.OWNER,
		});

		const token = await this.login({
			email: userValidatedData.email,
			password: userValidatedData.password,
		});

		const { password: _, ...userWithoutPassword } = newUser.toObject();
		return { ...userWithoutPassword, token };
	}

	async logout(userID: string) {
		try {
			await User.findByIdAndUpdate(userID, { refreshToken: null });
		} catch (_error) {
			throw new InternalException(
				ErrorMessage.SOMETHING_WENT_WRONG,
				ErrorCode.SOMETHING_WENT_WRONG,
			);
		}
	}

	async resetPassword() {}

	async refreshToken(userID: string) {
		try {
			const user = await User.findById(userID);
			if (!user) {
				throw new BadRequest(
					ErrorMessage.USER_NOT_FOUND,
					ErrorCode.USER_NOT_FOUND,
				);
			}

			const payload: JWTPayload = { id: user._id };

			const token = jwtService.generateToken(payload);
			const refreshToken = jwtService.generateRefreshToken(payload);

			user.refreshToken = refreshToken;

			await user.save();

			return token;
		} catch (_error) {
			throw new InternalException(
				ErrorMessage.SOMETHING_WENT_WRONG,
				ErrorCode.SOMETHING_WENT_WRONG,
			);
		}
	}
}

export default new AuthService();
