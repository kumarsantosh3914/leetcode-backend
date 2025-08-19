import express from "express";
import { createProblemHandler, deleteProblemHandler, getAllProblemsHandler, getProblemHandler, updateProblemHandler } from "../../controllers/problem.controller";

const problemRouter = express.Router();

problemRouter.post(
  "/",
  createProblemHandler
);
problemRouter.get("/:id", getProblemHandler);
problemRouter.get("/", getAllProblemsHandler);
problemRouter.delete("/:id", deleteProblemHandler);
problemRouter.put(
  "/:id",
  updateProblemHandler
);

export default problemRouter;
