import { createProblemDTO } from "../dto/problem.dto";
import { ProblemRepository } from "../repositories/problem.repository";

const problemRepository = new ProblemRepository();

export async function createProblemService(problemDto: createProblemDTO) {
    const problem = await problemRepository.create(problemDto);
    return problem;
}

export async function getProblemByIdService(id: string) {
    const problem = await problemRepository.findById(id);
    return problem;
}

export async function getAllProblemsService() {
    const problems = await problemRepository.findAll();
    return problems;
}

export async function deleteProblemService(id: string) {
    const problem = await problemRepository.delete(id);
    return problem;
}

export async function updateProblemService(id: string, problemDto: createProblemDTO) {
    const problem = await problemRepository.update(id, problemDto);
    return problem;
}