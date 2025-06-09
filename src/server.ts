import app from "./app";
import connectDB from "./config/database";
import { PORT } from "./secrets";

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
