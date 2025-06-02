import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URL;
        if (!mongoURI) {
            console.error("MONGODB_URI not found in environment variables");
            process.exit(1);
        }

        await mongoose.connect(mongoURI);
        console.log("MongoDB connected");
    } catch (error: any) {
        console.error("MongoDB connection error: ", error);
        process.exit(1);
    }
}

export default connectDB;
