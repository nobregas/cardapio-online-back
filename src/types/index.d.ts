import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../models/enums/roles";

interface IUserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    export interface Request {
      user?: IUserPayload;
    }
  }
}
