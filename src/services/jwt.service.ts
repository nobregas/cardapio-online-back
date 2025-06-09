import { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../secrets";

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
