# LeetCode Backend Monorepo

This repository contains three independent TypeScript/Express microservices:

- ProblemService — Problems, categories, and companies CRUD.
- SubmissionService — Code submission lifecycle and queuing to Evaluation.
- EvaluationService — Background evaluation of submissions in Docker containers.

Each service is standalone (own server, config, dependencies). They communicate via HTTP (Problem/Submission API) and Redis/BullMQ (Submission jobs).

## Prerequisites

- Node.js 18+
- npm
- MongoDB
- Redis
- Docker (required for EvaluationService)

## Repository Structure

- `EvaluationService/`
- `ProblemService/`
- `SubmissionService/`

Each service has:
- `src/` with config, routers, controllers, middlewares
- `package.json` with start/dev scripts
- `tsconfig.json`
- `.env` (local config)

## Service Overview

### ProblemService

Purpose:
- Manage coding problems, categories, companies, tags, testcases, statements, stats.

Server:
- Entry: `ProblemService/src/server.ts`
- Routers: `ProblemService/src/routers/v1/*.router.ts`
- Middleware: correlation ID, structured error handlers
- DB: MongoDB (via `mongoose`)

Env:
- `PORT`: number (default 3000)
- `DB_URI`: MongoDB connection string

Scripts:
- `npm run dev` — nodemon src/server.ts
- `npm run start` — ts-node src/server.ts

Base URL:
- `http://localhost:PORT/api/v1`

Endpoints (v1):
- Ping
  - GET `/ping`
- Categories (`category.router.ts`)
  - POST `/categories`
  - GET `/categories`
  - GET `/categories/:id`
  - PUT `/categories/:id`
  - DELETE `/categories/:id`
- Companies (`company.router.ts`)
  - POST `/companies`
  - GET `/companies`
  - GET `/companies/:id`
  - PUT `/companies/:id`
  - DELETE `/companies/:id`
- Problems (`problem.router.ts`)
  - POST `/problems`
  - GET `/problems`
  - GET `/problems/count`
  - GET `/problems/random`
  - GET `/problems/slug-available`
  - GET `/problems/slug/:slug`
  - GET `/problems/:id`
  - PUT `/problems/:id`
  - PATCH `/problems/:id`
  - DELETE `/problems/:id`
  - DELETE `/problems/:id/soft`
  - Tags
    - GET `/problems/:id/tags`
    - POST `/problems/:id/tags`
    - DELETE `/problems/:id/tags/:tag`
  - Companies
    - GET `/problems/:id/companies`
    - POST `/problems/:id/companies`
    - DELETE `/problems/:id/companies/:companyId`
  - Statement / Meta / Stats
    - GET `/problems/:id/statement`
    - PATCH `/problems/:id/statement`
    - GET `/problems/:id/meta`
    - GET `/problems/:id/stats`
  - Testcases
    - GET `/problems/:id/testcases`
    - POST `/problems/:id/testcases`
    - PATCH `/problems/:id/testcases/:index`
    - DELETE `/problems/:id/testcases/:index`
    - POST `/problems/:id/testcases/validate`

### SubmissionService

Purpose:
- Accept code submissions for a problem.
- Validate with ProblemService.
- Persist submission and enqueue a BullMQ job to EvaluationService.

Server:
- Entry: `SubmissionService/src/server.ts`
- Dependencies: axios, bullmq/ioredis, mongoose
- Queue: `submission` (BullMQ), see `src/queues/submission.queue.ts`
- Producer: `src/producers/submission.producer.ts`

Env:
- `PORT`: number (default assumed 3001)
- `DB_URI`: MongoDB connection string
- `REDIS_HOST`: host (default localhost)
- `REDIS_PORT`: port (default 6379)
- `PROBLEM_SERVICE`: ProblemService base URL for lookups (default `http://localhost:3000/api/v1`)

Scripts:
- `npm run dev` — nodemon src/server.ts
- `npm run start` — ts-node src/server.ts

Base URL:
- `http://localhost:PORT/api/v1`

Endpoints:
- Ping
  - GET `/ping`
- Submissions (`submission.router.ts`) — routes present but not wired into v1 index yet.
  - POST `/submissions`
  - GET `/submissions/:id`
  - GET `/submissions/problem/:problemId`
  - DELETE `/submissions/:id`
  - PATCH `/submissions/:id/status`

Important:
- To expose submissions API, mount the router in `src/routers/v1/index.router.ts`:
  - `v1Router.use('/submissions', submissionRouter);`

Processing Flow:
1) Client POSTs submission -> validate body with zod.
2) Service fetches problem via PROBLEM_SERVICE.
3) Persist submission.
4) Enqueue job with queue name "submission".
5) EvaluationService worker consumes and performs code execution.

### EvaluationService

Purpose:
- Consume submission jobs and evaluate code safely in Docker containers.
- Supports Python and C++ code execution with time/memory limits.

Server/Worker:
- Entry: `EvaluationService/src/server.ts`
  - Starts Express
  - Starts BullMQ worker: `src/workers/evaluation.worker.ts`
  - Pulls Docker images on boot: `src/utils/containers/pullImage.util.ts` (invoked)
  - Runs sample code tests on boot (for dev/demo): `testPythonCodeWithInput`, `testCppCodeWithInput`

Job Queue:
- Name: `submission` (see `src/utils/constants.ts`)
- Worker: `src/workers/evaluation.worker.ts` (currently logs job lifecycle)

Code Runner:
- `src/utils/containers/codeRunner.ts`
  - Starts Docker container via `dockerode` with controlled CPU/memory, no network, no-new-privileges.
  - Commands builder: `src/utils/containers/commands.util.ts`
  - Languages allowed: `python`, `cpp`.
  - Images: `PYTHON_IMAGE=python:3.8-slim`, `CPP_IMAGE=gcc:latest`

Env:
- `PORT`: number (default assumed 3002)
- `MONGODB_URI`: MongoDB connection string
- `PROBLEM_SERVICE`: ProblemService base URL (default `http://localhost:3000/api/v1`)
- `SUBMISSION_SERVICE`: SubmissionService base URL (default `http://localhost:3001/api/v1`)
- `REDIS_HOST`: host (default localhost)
- `REDIS_PORT`: port (default 6379)

Scripts:
- `npm run dev` — nodemon src/server.ts
- `npm run start` — ts-node src/server.ts

Note:
- Startup runs sample code exec for Python/CPP. Remove/guard these for production.

## Local Development

Recommended ports:
- ProblemService: 3000
- SubmissionService: 3001
- EvaluationService: 3002

Example `.env` files (adjust as needed):

`ProblemService/.env`
- `PORT=3000`
- `DB_URI=mongodb://localhost:27017/leetcode_problems`

`SubmissionService/.env`
- `PORT=3001`
- `DB_URI=mongodb://localhost:27017/leetcode_submissions`
- `REDIS_HOST=localhost`
- `REDIS_PORT=6379`
- `PROBLEM_SERVICE=http://localhost:3000/api/v1`

`EvaluationService/.env`
- `PORT=3002`
- `MONGODB_URI=mongodb://localhost:27017/leetcode_evaluation`
- `PROBLEM_SERVICE=http://localhost:3000/api/v1`
- `SUBMISSION_SERVICE=http://localhost:3001/api/v1`
- `REDIS_HOST=localhost`
- `REDIS_PORT=6379`

Start services (in separate terminals):
- ProblemService: `npm install && npm run dev`
- SubmissionService: `npm install && npm run dev`
- EvaluationService: `npm install && npm run dev`

Dependencies required:
- MongoDB running locally
- Redis running locally
- Docker daemon running (EvaluationService)

## Inter-service Communication

- SubmissionService -> ProblemService (HTTP)
  - Validate problem existence before enqueuing
- SubmissionService -> EvaluationService (Redis/BullMQ)
  - Enqueue to "submission" queue
- EvaluationService consumes queue and runs code with Docker
  - Uses container resource limits and no network for safety

## Logging and Error Handling

- Shared patterns:
  - Correlation ID middleware for tracing
  - Centralized error handlers
  - Winston logger (with transports configured per service)

## Roadmap / Gaps

- Wire `SubmissionService` submissions router into v1 index to expose its API.
- Replace demo code-exec on EvaluationService startup with real job handling.
- Add auth/rate limiting if needed.
