import mongoose from "mongoose";
import { MONGO_URL } from "../secrets";

const connectDB = async () => {
	try {
		const mongoURI = MONGO_URL;
		if (!mongoURI) {
			console.error("MONGO_URL not found in environment variables");
			process.exit(1);
		}

		await mongoose.connect(mongoURI);
		console.log("MongoDB connected");
	} catch (error: unknown) {
		console.error("MongoDB connection error: ", error);
		process.exit(1);
	}
};

export default connectDB;
