import express from "express";
import { Express } from "express";
import { serverConfig } from "./config";
import v1Router from "./routers/v1/index.router";
import v2Router from "./routers/v2/index.router";
import {
  appErrorHandler,
  genericErrorHandler,
} from "./middlewares/error.middleware";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import logger from "./config/logger.config";
import initEvaluationWorker from "./workers/evaluation.worker";
import { pullAllImages } from "./utils/containers/pullImage.util";
// import { runCode } from "./utils/containers/codeRunner";
// import { CPP_IMAGE } from "./utils/constants";

const app: Express = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Regestering all the routers and their corresponding routes with out app server object.
app.use(attachCorrelationIdMiddleware);
app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

app.use(appErrorHandler);
// Middleware to handle errors
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);

  await initEvaluationWorker();
  logger.info("Evaluation worker started successfully");

  await pullAllImages();
  logger.info("All Docker images are pulled and ready to use");

  // await testPythonCodeWithInput();
  // await testCppCodeWithInput();
});

// async function testPyThonCode() {
//     const pythonCode = `
// import time
// i = 0
// while True:
//     i += 1
//     print(i)
//     time.sleep(1)

// print("Bye")
//     `;
//     // 1. Take the python code and dump in a file and run the python file in the container

//     await runCode({
//         code: pythonCode,
//         language: "python",
//         timeout: 3000,
//         imageName: PYTHON_IMAGE
//     });
// }

// async function testPythonCodeWithInput() {
//   const pythonCode = `
// name = input("Enter your name: ")
// age = int(input("Enter your age: "))
// print(f"Hello {name}, you are {age} years old!")
//     `;

//   const userInput = "Santosh Kumar\n21";

//   await runCode({
//     code: pythonCode,
//     language: "python",
//     timeout: 3000,
//     imageName: PYTHON_IMAGE,
//     input: userInput,
//   });
// }

// async function testCppCodeWithInput() {
//   const cppCode = `
// #include <iostream>
// #include <string>
// using namespace std;

// int main() {
//     int n;
//     std::cin>>n;

//     for(int i=0; i<n; i++) {
//         std::cout<<i<<std::endl;
//     }
//     return 0;
// }
//     `;

//   await runCode({
//     code: cppCode,
//     language: "cpp",
//     timeout: 3000,
//     imageName: CPP_IMAGE,
//     input: "10",
//   });
// }
