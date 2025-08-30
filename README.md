# LeetCode Backend Monorepo

This repository contains three independent TypeScript/Express microservices that form a complete coding problem evaluation platform:

- **ProblemService** — Complete CRUD operations for coding problems, categories, companies, tags, testcases, statements, and statistics
- **SubmissionService** — Code submission lifecycle management with validation and job queuing
- **EvaluationService** — Background evaluation of submissions in isolated Docker containers

Each service is standalone with its own server, configuration, dependencies, and database. They communicate via HTTP APIs and Redis/BullMQ for job queuing.

## Prerequisites

- **Node.js 18+**
- **npm** (comes with Node.js)
- **MongoDB** (running locally or remote)
- **Redis** (running locally or remote)
- **Docker** (required for EvaluationService - must be running with daemon)

## Repository Structure

```
LeetCode-Backend/
├── EvaluationService/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, Redis, Logger)
│   │   ├── controllers/     # Request handlers
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── middlewares/     # Express middlewares (error, correlation)
│   │   ├── routers/         # API route definitions
│   │   ├── utils/           # Core utilities (Docker, constants)
│   │   ├── validators/      # Request validation schemas
│   │   └── workers/         # BullMQ job processors
│   ├── package.json
│   ├── tsconfig.json
│   └── logs/
├── ProblemService/
│   ├── src/
│   │   ├── config/          # Database and logger config
│   │   ├── controllers/     # Business logic handlers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── repositories/    # Data access layer
│   │   ├── routers/         # API route definitions
│   │   ├── services/        # Business logic services
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper utilities
│   │   └── validators/      # Zod validation schemas
│   ├── package.json
│   ├── tsconfig.json
│   └── logs/
├── SubmissionService/
│   ├── src/
│   │   ├── apis/            # External API clients
│   │   ├── config/          # Database and Redis config
│   │   ├── controllers/     # Request handlers
│   │   ├── factories/       # Dependency injection factories
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── producers/       # BullMQ job producers
│   │   ├── queues/          # Queue configurations
│   │   ├── repositories/    # Data access layer
│   │   ├── routers/         # API route definitions
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Helper utilities
│   │   └── validators/      # Zod validation schemas
│   ├── package.json
│   ├── tsconfig.json
│   └── logs/
└── README.md
```

Each service has:
- `src/` with organized, modular code structure
- `package.json` with service-specific dependencies and scripts
- `tsconfig.json` with TypeScript configuration
- `.env` (local environment configuration)
- `logs/` directory for Winston logger output

## Architecture Overview

### Design Patterns & Technologies

- **ProblemService**: Traditional MVC architecture with Repository pattern
- **SubmissionService**: Factory pattern for dependency injection with Repository-Service-Controller layers
- **EvaluationService**: Worker-based architecture with BullMQ job processing

### Shared Technologies Across Services
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with strict mode
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schemas for request validation
- **Logging**: Winston with daily rotation and MongoDB transport
- **Error Handling**: Structured error responses with correlation IDs
- **Process Management**: Nodemon for development

### Service-Specific Technologies
- **SubmissionService**: BullMQ + Redis for job queuing
- **EvaluationService**: Dockerode for container management, BullMQ worker

## Service Details

### ProblemService

**Purpose**: Complete problem management system with full CRUD operations.

**Architecture**: MVC pattern with Repository layer for data access.

**Key Features**:
- Problem CRUD with soft delete support
- Category and company management
- Tag system for problem categorization
- Test case management and validation
- Code template support for multiple languages
- Problem statistics and metadata
- Full-text search capabilities
- Slug-based URL generation

**Database Models**:
- **Problem**: Core problem data with test cases, templates, tags, companies
- **Category**: Problem categorization
- **Company**: Company information for interview questions

**Server**:
- Entry: `ProblemService/src/server.ts`
- Framework: Express.js with TypeScript
- Database: MongoDB via Mongoose
- Validation: Zod schemas
- Logging: Winston with file and MongoDB transports

**Dependencies**:
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.17.1",
  "zod": "^3.24.2",
  "winston": "^3.17.0",
  "winston-daily-rotate-file": "^5.0.0",
  "winston-mongodb": "^6.0.0",
  "dotenv": "^16.5.0",
  "uuid": "^11.1.0"
}
```

**Environment Variables**:
```bash
PORT=3000
DB_URI=mongodb://localhost:27017/leetcode_problems
```

**Scripts**:
- `npm run dev` — Development with nodemon auto-restart
- `npm run start` — Production with ts-node

**Base URL**: `http://localhost:PORT/api/v1`

**Endpoints**:
- **Ping**: `GET /ping` - Health check
- **Problems**:
  - `POST /problems` - Create problem
  - `GET /problems` - List problems with pagination
  - `GET /problems/count` - Get total problem count
  - `GET /problems/random` - Get random problem
  - `GET /problems/slug-available` - Check slug availability
  - `GET /problems/slug/:slug` - Get problem by slug
  - `GET /problems/:id` - Get problem by ID
  - `PUT /problems/:id` - Update problem
  - `PATCH /problems/:id` - Partial update
  - `DELETE /problems/:id` - Hard delete
  - `DELETE /problems/:id/soft` - Soft delete
- **Tags**: `GET|POST|DELETE /problems/:id/tags`
- **Companies**: `GET|POST|DELETE /problems/:id/companies`
- **Statements**: `GET|PATCH /problems/:id/statement`
- **Metadata**: `GET /problems/:id/meta`
- **Statistics**: `GET /problems/:id/stats`
- **Test Cases**: `GET|POST|PATCH|DELETE /problems/:id/testcases`
- **Categories**: `GET|POST|GET|PUT|DELETE /categories`
- **Companies**: `GET|POST|GET|PUT|DELETE /companies`

### SubmissionService

**Purpose**: Handle code submissions, validate problems, and queue evaluation jobs.

**Architecture**: Factory pattern with dependency injection, Repository-Service-Controller layers.

**Key Features**:
- Submission validation against ProblemService
- BullMQ job queuing for evaluation
- Submission status tracking
- Query submissions by problem
- Factory-based dependency management

**Database Models**:
- **Submission**: Code, language, status, problem reference, test case results

**Supported Languages**: Python, C++

**Server**:
- Entry: `SubmissionService/src/server.ts`
- External APIs: Axios client for ProblemService communication
- Queue: BullMQ with Redis
- Database: MongoDB via Mongoose

**Dependencies**:
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.18.0",
  "bullmq": "^5.58.1",
  "ioredis": "^5.7.0",
  "axios": "^1.11.0",
  "zod": "^3.24.2",
  "winston": "^3.17.0",
  "winston-daily-rotate-file": "^5.0.0",
  "winston-mongodb": "^6.0.0",
  "dotenv": "^16.5.0",
  "uuid": "^11.1.0"
}
```

**Environment Variables**:
```bash
PORT=3001
DB_URI=mongodb://localhost:27017/leetcode_submissions
REDIS_HOST=localhost
REDIS_PORT=6379
PROBLEM_SERVICE=http://localhost:3000/api/v1
```

**Scripts**:
- `npm run dev` — Development with nodemon
- `npm run start` — Production with ts-node

**Base URL**: `http://localhost:PORT/api/v1`

**Endpoints**:
- **Ping**: `GET /ping` - Health check
- **Submissions**:
  - `POST /submissions` - Create new submission
  - `GET /submissions/:id` - Get submission by ID
  - `GET /submissions/problem/:problemId` - Get submissions for problem
  - `DELETE /submissions/:id` - Delete submission
  - `PATCH /submissions/:id/status` - Update submission status

**Processing Flow**:
1. Client submits code via POST /submissions
2. Validate request body with Zod schema
3. Fetch problem details from ProblemService
4. Persist submission in database
5. Queue evaluation job to BullMQ "submission" queue
6. Return submission ID to client

### EvaluationService

**Purpose**: Execute submitted code safely in Docker containers and evaluate against test cases.

**Architecture**: Worker-based with BullMQ job processing and Docker container management.

**Key Features**:
- Isolated code execution in Docker containers
- Multi-language support (Python, C++)
- Resource limits and security constraints
- Test case evaluation with result matching
- Job queue processing with error handling
- Real-time status updates to SubmissionService

**Supported Languages**:
- **Python**: `python:3.8-slim` image, 4-second timeout
- **C++**: `gcc:latest` image, 4-second timeout

**Security Features**:
- No network access in containers
- Memory limit: 1GB per container
- CPU resource constraints
- No new privileges
- Isolated execution environment

**Database**: MongoDB (primarily for logging, submissions managed via API)

**Server/Worker**:
- Entry: `EvaluationService/src/server.ts`
- Starts Express server and BullMQ worker
- Pulls Docker images on startup
- Processes jobs from "submission" queue

**Code Execution Flow**:
1. Receive job from BullMQ queue
2. Extract code, language, test cases from job data
3. Create Docker container with appropriate image
4. Execute code against each test case in parallel
5. Compare outputs with expected results
6. Update submission status via SubmissionService API
7. Clean up Docker container

**Dependencies**:
```json
{
  "express": "^5.1.0",
  "bullmq": "^5.58.1",
  "dockerode": "^4.0.7",
  "@types/dockerode": "^3.3.43",
  "ioredis": "^5.7.0",
  "axios": "^1.11.0",
  "mongoose": "^8.13.2",
  "zod": "^3.24.2",
  "winston": "^3.17.0",
  "winston-daily-rotate-file": "^5.0.0",
  "winston-mongodb": "^6.0.0",
  "dotenv": "^16.5.0",
  "uuid": "^11.1.0"
}
```

**Environment Variables**:
```bash
PORT=3002
MONGODB_URI=mongodb://localhost:27017/leetcode_evaluation
PROBLEM_SERVICE=http://localhost:3000/api/v1
SUBMISSION_SERVICE=http://localhost:3001/api/v1
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Scripts**:
- `npm run dev` — Development with nodemon
- `npm run start` — Production with ts-node

**Evaluation Results**:
- **AC**: Accepted (output matches expected)
- **WA**: Wrong Answer (output doesn't match)
- **TLE**: Time Limit Exceeded
- **Error**: Runtime/compilation error

## Inter-service Communication

### HTTP APIs
- **SubmissionService → ProblemService**: Validate problem existence before queuing
- **EvaluationService → ProblemService**: Fetch problem details and test cases
- **EvaluationService → SubmissionService**: Update submission status and results

### BullMQ Queues (Redis)
- **SubmissionService → EvaluationService**: "submission" queue for evaluation jobs
- **Configuration**: 3 retry attempts with exponential backoff (2-second delay)

### Data Flow
1. **Client** → **SubmissionService** (POST /submissions)
2. **SubmissionService** → **ProblemService** (GET problem details)
3. **SubmissionService** → **Redis Queue** (enqueue evaluation job)
4. **EvaluationService Worker** ← **Redis Queue** (dequeue job)
5. **EvaluationService** → **ProblemService** (GET test cases)
6. **EvaluationService** → **Docker** (execute code in container)
7. **EvaluationService** → **SubmissionService** (PATCH submission status)
8. **Client** ← **SubmissionService** (GET submission results)

## Local Development Setup

### Recommended Ports
- **ProblemService**: 3000
- **SubmissionService**: 3001
- **EvaluationService**: 3002

### Environment Configuration

**ProblemService/.env**
```bash
PORT=3000
DB_URI=mongodb://localhost:27017/leetcode_problems
```

**SubmissionService/.env**
```bash
PORT=3001
DB_URI=mongodb://localhost:27017/leetcode_submissions
REDIS_HOST=localhost
REDIS_PORT=6379
PROBLEM_SERVICE=http://localhost:3000/api/v1
```

**EvaluationService/.env**
```bash
PORT=3002
MONGODB_URI=mongodb://localhost:27017/leetcode_evaluation
PROBLEM_SERVICE=http://localhost:3000/api/v1
SUBMISSION_SERVICE=http://localhost:3001/api/v1
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Startup Sequence
```bash
# Terminal 1 - ProblemService
cd ProblemService
npm install
npm run dev

# Terminal 2 - SubmissionService
cd SubmissionService
npm install
npm run dev

# Terminal 3 - EvaluationService
cd EvaluationService
npm install
npm run dev
```

### Required Services
- **MongoDB**: `mongod` running locally
- **Redis**: `redis-server` running locally
- **Docker**: Daemon running for EvaluationService

## Logging and Monitoring

### Winston Logger Configuration
- **Transports**: Console, Daily Rotate Files, MongoDB
- **Log Levels**: error, warn, info, debug
- **File Rotation**: Daily with 30-day retention
- **MongoDB Collection**: Separate collections per service

### Correlation ID Middleware
- Unique request ID generation
- Request tracing across services
- Error correlation for debugging

### Structured Error Handling
- Centralized error handlers per service
- Consistent error response format
- HTTP status code mapping

## TypeScript Configuration

### Shared Settings
- **Target**: ES2016
- **Module**: CommonJS
- **Root Directory**: `./src`
- **Output Directory**: `./dist`
- **Strict Mode**: Enabled
- **ES Module Interop**: Enabled
- **Source Maps**: Generated

### Key Compiler Options
```json
{
  "strict": true,
  "noUnusedLocals": true,
  "esModuleInterop": true,
  "forceConsistentCasingInFileNames": true,
  "skipLibCheck": true
}
```

## API Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "correlationId": "unique-request-id"
}
```

## Roadmap & Future Enhancements

- [ ] Wire SubmissionService submissions router into v1 index (currently commented)
- [ ] Add authentication and authorization
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add monitoring and metrics (Prometheus)
- [ ] Add more programming languages support
- [ ] Implement code plagiarism detection
- [ ] Add leaderboard and ranking system
- [ ] Add problem difficulty voting
- [ ] Implement code execution caching
- [ ] Add support for custom test cases
- [ ] Add problem discussion/comments system