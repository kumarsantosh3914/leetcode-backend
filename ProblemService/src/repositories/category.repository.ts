import BaseRepository from "./base.repository";
import Category from "../models/category";
import { ICategory } from "../types/category.types";

export class CategoryRepository extends BaseRepository<ICategory> {
    constructor() {
        super(Category);
    }
}