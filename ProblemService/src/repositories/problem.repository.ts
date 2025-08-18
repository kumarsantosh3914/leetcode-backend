import Problem from "../models/problem";
import { IProblem } from "../types/problem.types";
import BaseRepository from "./base.repository";

export class ProblemRepository extends BaseRepository<IProblem> {
    constructor() {
        super(Problem);
    }
}