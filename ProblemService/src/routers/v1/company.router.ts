import express from "express";
import {
  createCompanyHandler,
  deleteCompanyHandler,
  getAllCompaniesHandler,
  getCompanyHandler,
  updateCompanyHandler,
} from "../../controllers/company.controller";
import { validateRequestBody } from "../../validators";
import { companySchema } from "../../validators/company.validator";

const companyRouter = express.Router();

companyRouter.post(
  "/",
  validateRequestBody(companySchema),
  createCompanyHandler
);
companyRouter.get("/:id", getCompanyHandler);
companyRouter.get("/", getAllCompaniesHandler);
companyRouter.delete("/:id", deleteCompanyHandler);
companyRouter.put(
  "/:id",
  validateRequestBody(companySchema),
  updateCompanyHandler
);

export default companyRouter;
