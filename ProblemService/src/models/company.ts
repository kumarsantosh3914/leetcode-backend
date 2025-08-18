import mongoose from "mongoose";
import { ICompany } from "../types/company.types";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [150, 'Name cannot be more than 150 characters'],
        unique: true,
        index: true
    },
    logoUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v: string) {
                // Basic URL validation
                return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
            },
            message: 'Please enter a valid URL for the logo'
        }
    }
}, { 
    timestamps: true,
    versionKey: false,
});

companySchema.index({ name: 1 });

// Add pre-save middleware for validation
companySchema.pre('save', function(next) {
    if (this.name) {
        this.name = this.name.trim();
    }
    next();
});

const Company = mongoose.model<ICompany>('Company', companySchema);
export default Company;