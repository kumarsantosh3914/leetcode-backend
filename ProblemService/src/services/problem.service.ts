import { createProblemDTO } from "../dto/problem.dto";
import { ProblemRepository } from "../repositories/problem.repository";

const problemRepository = new ProblemRepository();

export async function createProblemService(problemDto: createProblemDTO) {
    const problem = await problemRepository.create(problemDto);
    return problem;
}

export async function getProblemByIdService(id: number) {
    const problem = await problemRepository.findById(id);
    return problem;
}

export async function getAllProblemsService() {
    const problems = await problemRepository.findAll();
    return problems;
}

export async function deleteProblemService(id: number) {
    const problem = await problemRepository.delete(id);
    return problem;
}

export async function updateProblemService(id: number, problemDto: createProblemDTO) {
    const problem = await problemRepository.update(id, problemDto);
    return problem;
}