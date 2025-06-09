import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/routes";
import errorMiddleware from "./middleware/errorMiddleware";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use(errorMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Application is healthy" });
});

export default app;
