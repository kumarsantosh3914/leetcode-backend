import Company from "../models/company";
import { ICompany } from "../types/company.types";
import BaseRepository from "./base.repository";

export class CompanyRepository extends BaseRepository<ICompany> {
    constructor() {
        super(Company);
    }
}