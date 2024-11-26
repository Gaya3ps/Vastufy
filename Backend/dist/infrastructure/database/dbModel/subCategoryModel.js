"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcategory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the Subcategory schema
const SubcategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Subcategory name is required'],
        trim: true,
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId, // Reference to the Category model
        ref: 'Category', // Refers to Category model
        required: [true, 'Category ID is required'],
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
// Create and export the Mongoose model for Subcategory
exports.Subcategory = mongoose_1.default.model('Subcategory', SubcategorySchema);
