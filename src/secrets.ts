import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "SECRET";

export const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/cardapio";

export const PORT = process.env.PORT || 3000;
