import { Express } from "express";
import { UserRole } from "../../src/models/enums/roles";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface IDecodedToken {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
