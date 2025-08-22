import mongoose, { Schema } from "mongoose";
import { IProblem } from "../types/problem.types";

const codeTemplateSchema = new Schema({
    language: {
        type: String,
        required: [true, 'Programming language is required']
    },
    template: {
        type: String,
        required: [true, 'Code template is required']
    },
    defaultCode: {
        type: String
    }
}, { _id: false });

const testCaseSchema = new Schema({
    input: {
        type: String,
        required: [true, "Input is required"],
        trim: true,
    },
    output: {
        type: String,
        required: [true, "Output is required"],
        trim: true,
    }
}, { _id: false });

const problemSchema = new Schema({
    problemNumber: {
        type: Number,
        required: [true, 'Problem number is required'],
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: [150, 'Title cannot be more than 150 characters'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty level is required'],
        enum: {
            values: ["Easy", "Medium", "Hard"],
            message: '{VALUE} is not a valid difficulty level'
        }
    },
    acceptanceRate: {
        type: Number,
        min: [0, 'Acceptance rate cannot be negative'],
        max: [100, 'Acceptance rate cannot exceed 100']
    },
    totalSubmissions: {
        type: Number,
        min: [0, 'Total submissions cannot be negative'],
        default: 0
    },
    totalAccepted: {
        type: Number,
        min: [0, 'Total accepted cannot be negative'],
        default: 0
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    constraints: [{
        type: String,
        trim: true
    }],
    codeTemplates: {
        type: [codeTemplateSchema],
        validate: {
            validator: function(templates: any[]) {
                return templates.length > 0;
            },
            message: 'At least one code template is required'
        }
    },
    hints: [{
        type: String,
        trim: true
    }],
    editorials: [{
        type: Schema.Types.Mixed
    }],
    companies: [{
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }],
    similarProblems: [{
        type: Schema.Types.ObjectId,
        ref: 'Problem'
    }],
    followUp: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    testcases: [testCaseSchema],
}, {
    timestamps: true,
    versionKey: false,
});

// Indexes for better query performance
problemSchema.index({ title: 'text', description: 'text' });
problemSchema.index({ difficulty: 1, isActive: 1 });
problemSchema.index({ tags: 1 });

const Problem = mongoose.model<IProblem>('Problem', problemSchema);
export default Problem;