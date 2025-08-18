import type { SignOptions } from "jsonwebtoken";

import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../secrets";

export interface JWTPayload {
	id: unknown;
}

class JwtService {
	generateToken(payload: JWTPayload): string {
		const signOptions: SignOptions = {
			expiresIn: 86400,
			algorithm: "HS256",
		};

		const token = this.generateJwtToken(payload, JWT_SECRET, signOptions);

		return `Bearer ${token}`;
	}

	generateRefreshToken(payload: JWTPayload): string {
		const signOptions: SignOptions = {
			expiresIn: 999999,
			algorithm: "HS256",
		};

		const token = this.generateJwtToken(
			payload,
			REFRESH_TOKEN_SECRET,
			signOptions,
		);

		return `Bearer ${token}`;
	}

	private generateJwtToken(
		payload: JWTPayload,
		secret: string,
		options: SignOptions,
	): string {
		return jwt.sign(payload, secret, options);
	}
}

export default new JwtService();
