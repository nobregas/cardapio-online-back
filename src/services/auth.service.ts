import * as bcrypt from "bcryptjs";
import { LoginDTO } from "../dtos/auth/LoginDTO";
import { ErrorCode, ErrorMessage } from "../enums";
import { BadRequest } from "../exceptions/BadRequest";
import User from "../models/user.model";
import { RegisterDTO } from "../dtos/auth/RegisterDTO";
import { UserRole } from "../models/enums/roles";
import { InternalException } from "../exceptions/InternalException";
import jwtService from "./jwt.service";

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
    const token = jwtService.generateToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

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
    try {
      await User.findByIdAndUpdate(userID, { refreshToken: null });
    } catch (error) {
      throw new InternalException(
        ErrorMessage.SOMETHING_WENT_WRONG,
        ErrorCode.SOMETHING_WENT_WRONG
      );
    }
  }

  resetPassword() {}

  async refreshToken(userID: string) {
    try {
      const user = await User.findById(userID);
      if (!user) {
        throw new BadRequest(
          ErrorMessage.USER_NOT_FOUND,
          ErrorCode.USER_NOT_FOUND
        );
      }

      const payload = { id: user._id };

      const token = jwtService.generateToken(payload);
      const refreshToken = jwtService.generateRefreshToken(payload);

      user.refreshToken = refreshToken;

      await user.save();

      return token;
    } catch (error) {
      throw new InternalException(
        ErrorMessage.SOMETHING_WENT_WRONG,
        ErrorCode.SOMETHING_WENT_WRONG
      );
    }
  }
}

export default new AuthService();
