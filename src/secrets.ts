import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

export const REFRESH_TOKEN_SECRET =
	process.env.REFRESH_TOKEN_SECRET || "SECRET";

export const MONGO_URL =
	process.env.MONGO_URL || "mongodb://localhost:27017/cardapio";

export const PORT = process.env.PORT || 3000;

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "";

if (!GEMINI_API_KEY) {
	console.warn("GEMINI_API_KEY is not defined");
}

if (!GEMINI_MODEL) {
	console.warn("GEMINI_MODEL is not defined");
}
