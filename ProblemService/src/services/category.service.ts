import { createCategoryDTO } from "../dto/category.dto";
import { CategoryRepository } from "../repositories/category.repository";

const categoryRepository = new CategoryRepository();

export async function createCategoryService(categoryDto: createCategoryDTO) {
    const category = await categoryRepository.create(categoryDto);
    return category;
}

export async function getCategoryByIdService(id: string) {
    const category = await categoryRepository.findById(id);
    return category;
}

export async function getAllCategoriesService() {
    const categories = await categoryRepository.findAll();
    return categories;
}

export async function deleteCategoryService(id: string) {
    const category = await categoryRepository.delete(id);
    return category;
}

export async function updateCategoryService(id: string, categoryDto: createCategoryDTO) {
    const category = await categoryRepository.update(id, categoryDto);
    return category;
}