import { Request, Response, NextFunction } from "express";
import { BadRequest } from "../exceptions/BadRequest";
import { ErrorCode, ErrorMessage, HttpStatus } from "../enums";
import User from "../models/user.model";
import * as jwt from 'jsonwebtoken';
import { SignOptions } from "jsonwebtoken";
import * as bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || "SECRET";
const TOKEN_DURATION = process.env.TOKEN_DURATION || 86400;

class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome, email, password } = req.body;
            
            if (!nome || !email || !password) {
                next(new BadRequest(ErrorMessage.VALIDATION_ERROR, ErrorCode.VALIDATION_ERROR));
            }

            if (password.length < 8) {
                next(new BadRequest(ErrorMessage.INVALID_PASSWORD, ErrorCode.INVALID_PASSWORD));
            }
            
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                next(new BadRequest(ErrorMessage.USER_ALREADY_EXISTS, ErrorCode.USER_ALREADY_EXISTS));
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({ nome, email, password: hashedPassword });
            const { password: _, ...userWithoutPassword } = newUser.toObject();
            res.status(HttpStatus.CREATED).json(userWithoutPassword);
        } catch (error) {
            next(error);
        }           
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
        
        if (!email || !password) {
            return next(new BadRequest(ErrorMessage.VALIDATION_ERROR, ErrorCode.VALIDATION_ERROR));
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return next(new BadRequest(ErrorMessage.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND));
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password); 
        if (!isPasswordValid) {
            return next(new BadRequest(ErrorMessage.INVALID_LOGIN, ErrorCode.INVALID_LOGIN));
        }
        const payload = { id: user._id };

        const signOptions: SignOptions = {
            expiresIn: 86400,
            algorithm: 'HS256' 
        };

        const token = jwt.sign(payload, JWT_SECRET, signOptions);

        res.json({ token });
    } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
