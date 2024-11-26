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
exports.PropertyModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the Property schema
const PropertySchema = new mongoose_1.Schema({
    propertyType: { type: String, required: true },
    expectedPrice: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subcategory: { type: String, required: true },
    ownershipStatus: { type: String, required: true },
    availableStatus: { type: String, required: true },
    saleType: { type: String, required: true },
    ageOfProperty: { type: String, required: true },
    carpetArea: { type: Number, required: true },
    builtUpArea: { type: Number, required: true },
    plotArea: { type: Number, required: true },
    washrooms: { type: String, required: true },
    totalFloors: { type: Number, required: true },
    floorNo: { type: Number, default: null }, // Optional field
    parking: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, required: true },
    zip: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    balconies: { type: Number, required: true },
    furnishingStatus: { type: String, required: true },
    powerBackup: { type: String, required: true },
    roadAccessibility: { type: String, required: true },
    mediaUrls: [{ type: String, required: true }],
    amenities: [{ type: String, required: true }],
    locationAdvantages: [{ type: String, required: true }],
    is_verified: { type: Boolean, default: false },
    vendor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Vendor", required: true }, // Array of amenities
    createdAt: { type: Date, default: Date.now }, // Date property was created
});
// Export the Property model
exports.PropertyModel = mongoose_1.default.model("Property", PropertySchema);
