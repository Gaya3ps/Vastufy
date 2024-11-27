"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminInteractor_1 = __importDefault(require("../../domain/usecases/auth/adminInteractor"));
const mongoVendorrepository_1 = require("../../infrastructure/repositories/mongoVendorrepository");
const console_1 = require("console");
const licenceModel_1 = require("../../infrastructure/database/dbModel/licenceModel");
const vendorModel_1 = require("../../infrastructure/database/dbModel/vendorModel");
const propertyModel_1 = require("../../infrastructure/database/dbModel/propertyModel");
exports.default = {
    adminLogin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log("yyyyyyyyy", req.body);
            const { email, password } = req.body;
            if (!email && !password) {
                throw new Error("user credentials not there");
            }
            const credentials = {
                email,
                password,
            };
            // console.log(credentials);
            const response = yield adminInteractor_1.default.loginAdmin(credentials);
            // console.log("fffffffffffffff", response);
            res.status(200).json({ message: "Login success", response });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield adminInteractor_1.default.getUsers();
            res.status(200).json(users);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    blockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const { is_blocked } = req.body;
            // console.log("Request Params:", req.params);
            // console.log("Request Body:", req.body);
            const updatedUser = yield adminInteractor_1.default.updatedUserStatus(userId, is_blocked);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    getVendors: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 20 } = req.query;
            const vendors = yield adminInteractor_1.default.getVendors(Number(page), Number(limit));
            res.status(200).json(vendors);
        }
        catch (error) {
            console.error("Error fetching vendors:", error);
            res.status(500).json({ error: "Failed to fetch vendors" });
        }
    }),
    getVendorById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendor = yield adminInteractor_1.default.fetchVendorById(req.params.id);
            if (!vendor)
                return res.status(404).json({ message: "Vendor not found" });
            res.status(200).json(vendor);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    getVerifiedVendors: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, mongoVendorrepository_1.getAllVendors)();
            (0, console_1.log)(response);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    blockVendor: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId } = req.params;
            const { is_blocked } = req.body;
            const updatedVendor = yield adminInteractor_1.default.updatedVendorStatus(vendorId, is_blocked);
            (0, console_1.log)("protectaDMIN CALLED");
            (0, console_1.log)(updatedVendor, "upppppp");
            res.status(200).json(updatedVendor);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    getLicenseByVendorEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.params;
        try {
            const license = yield licenceModel_1.LicenseModel.findOne({ email }).exec();
            if (!license) {
                return res.status(404).json({ message: "License not found" });
            }
            res.status(200).json(license);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error fetching license", error: error.message });
        }
    }),
    updateVendorVerificationStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { is_verified } = req.body;
            const vendor = yield adminInteractor_1.default.verifyVendor(req.params.id, is_verified);
            if (!vendor)
                return res.status(404).json({ message: "Vendor not found" });
            res.status(200).json(vendor);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    updateIsVerified: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const vendorId = req.params.vendorId;
        const { is_verified } = req.body;
        try {
            const updatedVendor = yield vendorModel_1.Vendor.findByIdAndUpdate(vendorId, { is_verified }, { new: true });
            res.json(updatedVendor);
        }
        catch (err) {
            console.error("Error updating vendor is_verified:", err);
            res.status(500).json({ error: "Failed to update vendor is_verified" });
        }
    }),
    addCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, description } = req.body;
            if (!name)
                return res.status(404).json({ message: "Category name  not found" });
            const newCategoryData = { name, description };
            const addCategoryData = yield adminInteractor_1.default.addCategory(newCategoryData);
            return res
                .status(201)
                .json({ message: "Category added successfully", addCategoryData });
        }
        catch (error) {
            console.error("Error adding category", error);
            res.status(500).json({ error: "Failed to add category" });
        }
    }),
    getCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield adminInteractor_1.default.getCategories();
            return res
                .status(200)
                .json({ message: "Fetched categories successfully", categories });
        }
        catch (error) {
            console.error("Error getting category", error);
            res.status(500).json({ error: "Failed to get category" });
        }
    }),
    editCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            if (!name || !id)
                return res
                    .status(404)
                    .json({ message: "Category name and id not found" });
            const categoryEdit = yield adminInteractor_1.default.editedCategory(id, {
                name,
                description,
            });
            return res.status(200).json(categoryEdit);
        }
        catch (error) {
            console.error("Error editing category", error);
            res.status(500).json({ error: "Failed to edit category" });
        }
    }),
    deleteCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(404).json({ message: "Category id not found" });
            const categoryDelete = yield adminInteractor_1.default.deletedCategory(id);
            return res.status(200).json(categoryDelete);
        }
        catch (error) {
            console.error("Error deleting category", error);
            res.status(500).json({ error: "Failed to delete category" });
        }
    }),
    addSubCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, categoryId } = req.body;
            if (!name || !categoryId)
                return res
                    .status(404)
                    .json({ message: "Subcategory name and id not found" });
            const newSubcategory = { name, categoryId };
            const addSubcategoryData = yield adminInteractor_1.default.addSubcategory(newSubcategory);
            return res.status(200).json(addSubcategoryData);
        }
        catch (error) { }
    }),
    getSubCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subCategories = yield adminInteractor_1.default.getSubCategories();
            return res
                .status(200)
                .json({ message: "Fetched subcategories successfully", subCategories });
        }
        catch (error) {
            console.error("Error getting subcategory", error);
            res.status(500).json({ error: "Failed to get subcategory" });
        }
    }),
    editSubCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, categoryId } = req.body;
            if (!id || !name || !categoryId)
                return res
                    .status(404)
                    .json({ message: "CategoryId ,name and id not found" });
            const editSubCategories = yield adminInteractor_1.default.editSubCategory(id, {
                name,
                categoryId,
            });
            return res.status(200).json(editSubCategories);
        }
        catch (error) {
            console.error("Error editing category", error);
            res.status(500).json({ error: "Failed to edit category" });
        }
    }),
    deleteSubCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id)
                return res.status(404).json({ message: "Subcategory id not found" });
            const subCategoryDelete = yield adminInteractor_1.default.deletedSubCategory(id);
            return res.status(200).json(subCategoryDelete);
        }
        catch (error) {
            console.error("Error deleting category", error);
            res.status(500).json({ error: "Failed to delete subcategory" });
        }
    }),
    getVerifiedProperties: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, mongoVendorrepository_1.getAllProperties)();
            (0, console_1.log)(response);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    verifyProperty: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const verifyProperties = yield adminInteractor_1.default.verifyProperties();
            res.status(200).json(verifyProperties);
        }
        catch (error) {
            console.error("Error fetching vendors:", error);
            res.status(500).json({ error: "Failed to fetch vendors" });
        }
    }),
    getPropertyById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { propertyId } = req.params;
            const property = yield adminInteractor_1.default.fetchPropertyById(propertyId);
            if (!property)
                return res.status(404).json({ message: "Property not found" });
            res.status(200).json(property);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    updatePropertyVerificationStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { is_verified } = req.body;
            const property = yield adminInteractor_1.default.verifyProperty(req.params.id, is_verified);
            if (!property)
                return res.status(404).json({ message: "Vendor not found" });
            res.status(200).json(property);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    updatePropertyIsVerified: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const propertyId = req.params.propertyId;
        const { is_verified } = req.body;
        try {
            const updatedProperty = yield propertyModel_1.PropertyModel.findByIdAndUpdate(propertyId, { is_verified }, { new: true });
            res.json(updatedProperty);
        }
        catch (err) {
            console.error("Error updating vendor is_verified:", err);
            res.status(500).json({ error: "Failed to update vendor is_verified" });
        }
    }),
    addSubscriptionPlan: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { planName, price, features, maxListings, prioritySupport } = req.body;
            if (!planName || !price || !features || !maxListings || prioritySupport === undefined) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if (prioritySupport !== "yes" && prioritySupport !== "no") {
                return res.status(400).json({ message: "Invalid value for prioritySupport" });
            }
            // Create the subscription plan through the adminInteractor
            const savedSubscriptionPlan = yield adminInteractor_1.default.addSubscriptionPlan({
                planName,
                price,
                features,
                maxListings,
                prioritySupport
            });
            // Respond with the saved subscription plan
            res.status(201).json({ message: "Subscription plan added successfully", plan: savedSubscriptionPlan });
        }
        catch (error) {
            console.error("Error adding subscription plan:", error);
            res.status(500).json({ error: "Failed to add subscription plan" });
            next(error);
        }
    }),
    getSubscriptionPlans: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield adminInteractor_1.default.getAllSubscriptionPlans();
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    toggleStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { planId, status } = req.body;
            const updatedPlan = yield adminInteractor_1.default.toggleStatus(planId, status);
            if (updatedPlan) {
                res.status(200).json({ message: 'Status updated successfully', updatedPlan });
            }
            else {
                res.status(404).json({ error: 'Subscription plan not found' });
            }
        }
        catch (error) {
            console.error('Failed to toggle status:', error);
            res.status(500).json({ error: 'Failed to update status' });
        }
    })
};
