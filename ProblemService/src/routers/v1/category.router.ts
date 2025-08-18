import express from "express";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
} from "../../controllers/category.controller";
import { validateRequestBody } from "../../validators";
import { categorySchema } from "../../validators/category.validator";

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  validateRequestBody(categorySchema),
  createCategoryHandler
);
categoryRouter.get("/:id", getCategoryHandler);
categoryRouter.get("/", getAllCategoriesHandler);
categoryRouter.delete("/:id", deleteCategoryHandler);
categoryRouter.put(
  "/:id",
  validateRequestBody(categorySchema),
  updateCategoryHandler
);

export default categoryRouter;
