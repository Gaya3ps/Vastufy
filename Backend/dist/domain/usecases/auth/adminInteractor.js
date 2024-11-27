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
Object.defineProperty(exports, "__esModule", { value: true });
const jwtHelper_1 = require("../../helper/jwtHelper");
const mongoAdminRepository_1 = require("../../../infrastructure/repositories/mongoAdminRepository");
const hashPassword_1 = require("../../helper/hashPassword");
const subscriptionPlanModel_1 = require("../../../infrastructure/database/dbModel/subscriptionPlanModel");
exports.default = {
    loginAdmin: (cred) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const admin = yield (0, mongoAdminRepository_1.findAdmin)(cred.email);
            console.log("admin isssss", admin);
            if (!admin || !admin.password) {
                throw new Error("Admin not found or password is missing");
            }
            const isValid = yield hashPassword_1.Encrypt.comparePassword(cred.password, admin.password);
            if (!isValid) {
                throw new Error("Invalid password");
            }
            const role = "admin";
            const tokenData = yield (0, jwtHelper_1.generateToken)(admin.id, cred.email, role);
            return {
                admin,
                token: tokenData.token,
                refreshToken: tokenData.refreshToken,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                throw error;
            }
            else {
                console.error("An unknown error occurred");
                throw new Error("An unknown error occurred");
            }
        }
    }),
    userList: () => __awaiter(void 0, void 0, void 0, function* () {
        const users = (0, mongoAdminRepository_1.getAllUsers)();
        return users;
    }),
    getUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, mongoAdminRepository_1.getPaginatedUsers)();
            return users;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    updatedUserStatus: (userId, is_blocked) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield (0, mongoAdminRepository_1.updateUserStatus)(userId, is_blocked);
            return updatedUser;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    getVendors: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendors = yield (0, mongoAdminRepository_1.getPaginatedVendors)(page, limit);
            return vendors;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    fetchVendorById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendor = yield (0, mongoAdminRepository_1.getVendorById)(id);
            return vendor;
        }
        catch (error) {
            console.error("Error fetching vendor by id:", error);
            throw new Error("Failed to fetch vendor");
        }
    }),
    updatedVendorStatus: (vendorId, is_blocked) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedVendor = yield (0, mongoAdminRepository_1.updateVendorStatus)(vendorId, is_blocked);
            return updatedVendor;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    verifyVendor: (id, is_verified) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updated = yield (0, mongoAdminRepository_1.updateVendorVerificationStatus)(id, is_verified);
            return updated;
        }
        catch (error) {
            console.error("Error verifying vendor:", error);
            throw new Error("Failed to verify vendor");
        }
    }),
    addCategory: (newCategoryData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!newCategoryData.name) {
                throw new Error("Category name is required");
            }
            // Save the new category to the database
            const newCategory = yield (0, mongoAdminRepository_1.addCategoryToDB)(newCategoryData);
            // Return the newly created category
            return newCategory;
        }
        catch (error) {
            // Re-throw error for proper handling
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    getCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categoryList = yield (0, mongoAdminRepository_1.listCategory)();
            return categoryList;
        }
        catch (error) { }
    }),
    editedCategory: (id, editedCategoryData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!editedCategoryData.name || !id) {
                throw new Error("Category name is required");
            }
            const categoryEdited = yield (0, mongoAdminRepository_1.editCategoryInDB)(id, editedCategoryData);
            return categoryEdited;
        }
        catch (error) {
            // Re-throw error for proper handling
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    deletedCategory: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!id) {
                throw new Error("Category id is required");
            }
            const categoryDeleted = yield (0, mongoAdminRepository_1.deleteCategoryInDB)(id);
            return categoryDeleted;
        }
        catch (error) {
            // Re-throw error for proper handling
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    addSubcategory: (newSubcategory) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!newSubcategory.name || !newSubcategory.categoryId) {
                throw new Error("Subcategory name and category id is required");
            }
            const newSubCategory = yield (0, mongoAdminRepository_1.addSubCategoryToDB)(newSubcategory);
            return newSubCategory;
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    getSubCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subCategoryList = yield (0, mongoAdminRepository_1.listsubCategory)();
            return subCategoryList;
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    editSubCategory: (id, editedSubCategoryData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!id ||
                !editedSubCategoryData.name ||
                !editedSubCategoryData.categoryId) {
                throw new Error("CategoryId, name, id is required");
            }
            const subCategoryEdited = yield (0, mongoAdminRepository_1.editSubCategoryInDB)(id, editedSubCategoryData);
            return subCategoryEdited;
        }
        catch (error) {
            // Re-throw error for proper handling
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    deletedSubCategory: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!id) {
                throw new Error("Subcategory id is required");
            }
            const subCategoryDeleted = yield (0, mongoAdminRepository_1.deletesubCategoryInDB)(id);
            return subCategoryDeleted;
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    // getPropertyList : async()=>{
    //   try {
    //     const properties = await listProperties();
    //     return properties;
    //   } catch (error) {
    //     throw new Error(
    //       error instanceof Error ? error.message : "Unknown error occurred"
    //     );
    //   }
    // },
    verifyProperties: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const properties = yield (0, mongoAdminRepository_1.propertyList)();
            return properties;
        }
        catch (error) {
            console.error("Error verifying vendor:", error);
            throw new Error("Failed to verify vendor");
        }
    }),
    fetchPropertyById: (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const property = yield (0, mongoAdminRepository_1.getPropertyById)(propertyId);
            console.log(property, "chukuchuku");
            return property;
        }
        catch (error) {
            console.error("Error fetching vendor by id:", error);
            throw new Error("Failed to fetch vendor");
        }
    }),
    verifyProperty: (id, is_verified) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedProperty = yield (0, mongoAdminRepository_1.updatePropertyVerificationStatus)(id, is_verified);
            return updatedProperty;
        }
        catch (error) {
            console.error("Error verifying vendor:", error);
            throw new Error("Failed to verify vendor");
        }
    }),
    addSubscriptionPlan: (subscriptionData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const formattedSubscriptionData = Object.assign(Object.assign({}, subscriptionData), { prioritySupport: subscriptionData.prioritySupport ? 'yes' : 'no' });
            // Delegate to the repository to add the subscription plan
            const savedSubscriptionPlan = yield (0, mongoAdminRepository_1.addSubscriptionPlanToDB)(subscriptionData);
            return savedSubscriptionPlan;
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    getAllSubscriptionPlans: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subscriptionPlans = yield (0, mongoAdminRepository_1.listSubscriptionPlans)();
            return subscriptionPlans;
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
        }
    }),
    toggleStatus: (planId, status) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedPlan = yield subscriptionPlanModel_1.SubscriptionPlanModel.findByIdAndUpdate(planId, { status }, { new: true });
            return updatedPlan;
        }
        catch (error) {
            console.error('Error updating subscription plan status:', error);
            throw new Error('Failed to update status');
        }
    })
};
