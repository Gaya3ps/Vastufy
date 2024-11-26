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
exports.Vendor = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const vendorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    licenseUrl: { type: String },
    mobileNumber: { type: Number, required: true },
    address: { type: String, required: false },
    coverpicture: { type: String },
    about: { type: String },
    is_verified: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    otp_verified: { type: Boolean, default: false },
    license: { type: mongoose_1.Schema.Types.ObjectId, ref: 'License' },
    properties: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Property' }],
    subscriptionPlan: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
    maxListings: { type: Number, default: 2 }, // Default to free limit (2 listings)
    listingsUsed: { type: Number, default: 0 }
}, {
    timestamps: true
});
exports.Vendor = mongoose_1.default.model('Vendor', vendorSchema);
