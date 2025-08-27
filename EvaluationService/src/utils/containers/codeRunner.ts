import { InternalServerError } from "../errors/app.error";
import { commands } from "./commands.util";
import { createNewDockerContainer } from "./createContainer.util";

const allowListedLanguage = ["python", "cpp"];

export interface RunCodeOptions {
    code: string;
    language: "python" | "cpp";
    timeout: number;
    imageName: string;
}

export async function runCode(options: RunCodeOptions) {
    const { code, language, timeout, imageName } = options;

    if (!allowListedLanguage.includes(language)) {
        throw new InternalServerError(`Language ${language} is not supported.`);
    }

    const container = await createNewDockerContainer({
        imageName: imageName,
        cmdExecutable: commands[language](code),
        memoryLimit: 1024 * 1024 * 1024, // 1GB
    });

    const timeLimitExceededTimeout = setTimeout(() => {
        console.log("Time limit exceeded");
        container?.kill();
    }, timeout);

    console.log("Container created successfully", container?.id);

    await container?.start();

     const status = await container?.wait();

    console.log("Container status", status);

    const logs = await container?.logs({
        stdout: true,
        stderr: true
    });

    console.log("Container logs", logs?.toString().trim());

    await container?.remove();

    clearTimeout(timeLimitExceededTimeout);

    if(status.StatusCode == 0) {
        // success
        console.log("Container exited successfully");
    } else {
        console.log("Container exited with error");
    }
}