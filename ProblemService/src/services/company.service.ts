import { createCompanyDTO } from "../dto/company.dto";
import { CompanyRepository } from "../repositories/company.repository";

const companyRepository = new CompanyRepository();

export async function createCompanyService(companyDto: createCompanyDTO) {
    const company = await companyRepository.create(companyDto);
    return company;
}

export async function companyByIdService(id: string) {
    const company = await companyRepository.findById(id);
    return company;
}

export async function getAllCompaniesService() {
    const companies = await companyRepository.findAll();
    return companies;
}

export async function deleteCompanyService(id: string) {
    const company = await companyRepository.delete(id);
    return company;
}

export async function updateCompanyService(id: string, companyDto: createCompanyDTO) {
    const company = await companyRepository.update(id, companyDto);
    return company;
}