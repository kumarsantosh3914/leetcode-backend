import mongoose from "mongoose";
import { ICategory } from "../types/category.types";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        max: [150, 'Name cannot be more than 150 characters'],
        unique: true,
        index: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    }
}, { 
    timestamps: true,
    versionKey: false
});

categorySchema.index({ name: 1 });

// Add pre-save middleware for validation
categorySchema.pre('save', function(next) {
    if (this.name) {
        this.name = this.name.toLowerCase();
    }
    next();
});

const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;