import express from "express";
import {
  createProblemHandler,
  deleteProblemHandler,
  getProblemHandler,
  updateProblemHandler,
  getProblemsHandler,
  getProblemsCountHandler,
  getProblemBySlugHandler,
  patchProblemHandler,
  softDeleteProblemHandler,
  getProblemTagsHandler,
  addProblemTagsHandler,
  removeProblemTagHandler,
  getProblemCompaniesHandler,
  addProblemCompaniesHandler,
  removeProblemCompanyHandler,
  getProblemStatementHandler,
  updateProblemStatementHandler,
  getProblemMetaHandler,
  getProblemStatsHandler,
  getProblemTestcasesHandler,
  addProblemTestcaseHandler,
  updateProblemTestcaseHandler,
  deleteProblemTestcaseHandler,
  validateProblemTestcasesHandler,
  getRandomProblemHandler,
  isSlugAvailableHandler,
} from "../../controllers/problem.controller";

const problemRouter = express.Router();

// Create
problemRouter.post("/", createProblemHandler);

// List & query
problemRouter.get("/", getProblemsHandler);
problemRouter.get("/count", getProblemsCountHandler);
problemRouter.get("/random", getRandomProblemHandler);
problemRouter.get("/slug-available", isSlugAvailableHandler);
problemRouter.get("/slug/:slug", getProblemBySlugHandler);

// Read single
problemRouter.get("/:id", getProblemHandler);

// Update
problemRouter.put("/:id", updateProblemHandler);
problemRouter.patch("/:id", patchProblemHandler);

// Delete (soft + hard existing)
problemRouter.delete("/:id", deleteProblemHandler);
problemRouter.delete("/:id/soft", softDeleteProblemHandler);

// Tags
problemRouter.get("/:id/tags", getProblemTagsHandler);
problemRouter.post("/:id/tags", addProblemTagsHandler);
problemRouter.delete("/:id/tags/:tag", removeProblemTagHandler);

// Companies
problemRouter.get("/:id/companies", getProblemCompaniesHandler);
problemRouter.post("/:id/companies", addProblemCompaniesHandler);
problemRouter.delete("/:id/companies/:companyId", removeProblemCompanyHandler);

// Statement / Meta / Stats
problemRouter.get("/:id/statement", getProblemStatementHandler);
problemRouter.patch("/:id/statement", updateProblemStatementHandler);
problemRouter.get("/:id/meta", getProblemMetaHandler);
problemRouter.get("/:id/stats", getProblemStatsHandler);

// Testcases
problemRouter.get("/:id/testcases", getProblemTestcasesHandler);
problemRouter.post("/:id/testcases", addProblemTestcaseHandler);
problemRouter.patch("/:id/testcases/:index", updateProblemTestcaseHandler);
problemRouter.delete("/:id/testcases/:index", deleteProblemTestcaseHandler);
problemRouter.post("/:id/testcases/validate", validateProblemTestcasesHandler);

export default problemRouter;
