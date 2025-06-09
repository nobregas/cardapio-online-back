import * as bcrypt from "bcryptjs";
import { LoginDTO } from "../dtos/auth/LoginDTO";
import { ErrorCode, ErrorMessage } from "../enums";
import { BadRequest } from "../exceptions/BadRequest";
import User from "../models/user.model";
import * as jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { RegisterDTO } from "../dtos/auth/RegisterDTO";
import { UserRole } from "../models/enums/roles";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";
const TOKEN_DURATION = process.env.TOKEN_DURATION || 86400;
const REFRESH_TOKEN_DURATION = 999999;
const REFRESH_TOKEN_SECRET = "SECRETT";

class AuthService {
  async login(credentials: LoginDTO): Promise<string> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new BadRequest(
        ErrorMessage.VALIDATION_ERROR,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequest(ErrorMessage.INVALID_LOGIN, ErrorCode.INVALID_LOGIN);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequest(ErrorMessage.INVALID_LOGIN, ErrorCode.INVALID_LOGIN);
    }

    const payload = { id: user._id };
    const signOptions: SignOptions = {
      expiresIn: 86400,
      algorithm: "HS256",
    };

    const refreshSignOptions: SignOptions = {
      expiresIn: REFRESH_TOKEN_DURATION,
      algorithm: "HS256",
    };

    const token = jwt.sign(payload, JWT_SECRET, signOptions);
    const refreshToken = jwt.sign(
      payload,
      REFRESH_TOKEN_SECRET,
      refreshSignOptions
    );

    user.refreshToken = refreshToken;

    await user.save();

    return token;
  }

  async register(userData: RegisterDTO) {
    const { name, email, password, phone } = userData;

    if (!name || !email || !password || !phone) {
      throw new BadRequest(
        ErrorMessage.VALIDATION_ERROR,
        ErrorCode.VALIDATION_ERROR
      );
    }

    if (password.length < 8) {
      throw new BadRequest(
        ErrorMessage.INVALID_PASSWORD,
        ErrorCode.INVALID_PASSWORD
      );
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      throw new BadRequest(ErrorMessage.INVALID_PHONE, ErrorCode.INVALID_PHONE);
    }

    const existingUser = await User.find({ email });
    if (existingUser) {
      throw new BadRequest(
        ErrorMessage.USER_ALREADY_EXISTS,
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      role: UserRole.OWNER,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  async logout(userID: string) {
    await User.findByIdAndUpdate(userID, { refreshToken: null });
  }

  resetPassword() {}

  refreshToken() {}
}

export default new AuthService();
