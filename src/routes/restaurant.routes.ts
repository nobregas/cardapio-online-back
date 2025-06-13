import { Router } from "express";
import RestaurantController from "../controllers/restaurant.controller";
import errorHandler from "../middleware/errorHandler";
const restaurantRoutes = Router();

restaurantRoutes.post("/create", errorHandler(RestaurantController.create));
restaurantRoutes.get("/all", errorHandler(RestaurantController.getAll));
restaurantRoutes.get(
  "/owner/:ownerId",
  errorHandler(RestaurantController.getByOwnerId)
);
restaurantRoutes.get("/:id", errorHandler(RestaurantController.getById));
restaurantRoutes.patch(
  "/update/:id",
  errorHandler(RestaurantController.update)
);
restaurantRoutes.delete("/:id", errorHandler(RestaurantController.delete));

export default restaurantRoutes;
