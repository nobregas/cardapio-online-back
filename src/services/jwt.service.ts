import { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "SECRET";

class JwtService {
  generateToken(payload: any) {
    const signOptions: SignOptions = {
      expiresIn: 86400,
      algorithm: "HS256",
    };

    return "Bearer " + jwt.sign(payload, JWT_SECRET, signOptions);
  }

  generateRefreshToken(payload: any) {
    const signOptions: SignOptions = {
      expiresIn: 999999,
      algorithm: "HS256",
    };

    return "Bearer " + jwt.sign(payload, REFRESH_TOKEN_SECRET, signOptions);
  }
}

export default new JwtService();
