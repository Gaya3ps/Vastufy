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
exports.changeToggleStatus = exports.listSubscriptionPlans = exports.addSubscriptionPlanToDB = exports.updatePropertyVerificationStatus = exports.getPropertyById = exports.propertyList = exports.deletesubCategoryInDB = exports.editSubCategoryInDB = exports.listsubCategory = exports.addSubCategoryToDB = exports.deleteCategoryInDB = exports.editCategoryInDB = exports.listCategory = exports.addCategoryToDB = exports.updateVendorVerificationStatus = exports.getUnverifiedVendors = exports.updateVendorStatus = exports.getVendorById = exports.updateUserStatus = exports.getPaginatedVendors = exports.getPaginatedUsers = exports.getAllUsers = exports.findAdmin = void 0;
const adminModel_1 = require("../database/dbModel/adminModel");
const userModel_1 = require("../database/dbModel/userModel");
const vendorModel_1 = require("../database/dbModel/vendorModel");
const console_1 = require("console");
const categoryModel_1 = require("../database/dbModel/categoryModel");
const subCategoryModel_1 = require("../database/dbModel/subCategoryModel");
const propertyModel_1 = require("../database/dbModel/propertyModel");
const subscriptionPlanModel_1 = require("../database/dbModel/subscriptionPlanModel");
const findAdmin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield adminModel_1.Admin.findOne({ email });
});
exports.findAdmin = findAdmin;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield userModel_1.Users.find();
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getAllUsers = getAllUsers;
const getPaginatedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.Users.find();
        return {
            users,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getPaginatedUsers = getPaginatedUsers;
const getPaginatedVendors = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield vendorModel_1.Vendor.find({ is_verified: false })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalVendors = yield vendorModel_1.Vendor.countDocuments();
        const totalPages = Math.ceil(totalVendors / limit);
        return {
            vendors,
            totalPages,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getPaginatedVendors = getPaginatedVendors;
const updateUserStatus = (userId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield userModel_1.Users.findByIdAndUpdate(userId, { is_blocked: isBlocked }, { new: true });
        return updatedUser;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.updateUserStatus = updateUserStatus;
const getVendorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findById(id);
});
exports.getVendorById = getVendorById;
const updateVendorStatus = (vendorId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedVndor = yield vendorModel_1.Vendor.findByIdAndUpdate(vendorId, { is_blocked: isBlocked }, { new: true });
        (0, console_1.log)(updatedVndor, "upvendor");
        return updatedVndor;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.updateVendorStatus = updateVendorStatus;
const getUnverifiedVendors = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield vendorModel_1.Vendor.find({ is_verified: false })
        .skip((page - 1) * limit)
        .limit(limit);
    const totalVendors = yield vendorModel_1.Vendor.countDocuments();
    return {
        vendors,
        totalPages: Math.ceil(totalVendors / limit),
    };
});
exports.getUnverifiedVendors = getUnverifiedVendors;
const updateVendorVerificationStatus = (id, is_verified) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findByIdAndUpdate(id, { is_verified: true }, { new: true });
});
exports.updateVendorVerificationStatus = updateVendorVerificationStatus;
const addCategoryToDB = (newCategoryData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategory = new categoryModel_1.Category({
            name: newCategoryData.name,
            description: newCategoryData.description,
        });
        const savedCategory = yield newCategory.save();
        return savedCategory;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.addCategoryToDB = addCategoryToDB;
const listCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listedCategories = yield categoryModel_1.Category.find();
        return listedCategories;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.listCategory = listCategory;
const editCategoryInDB = (id, editedCategoryData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCategory = yield categoryModel_1.Category.findByIdAndUpdate(id, {
            name: editedCategoryData.name,
            description: editedCategoryData.description,
        }, { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators` ensures validation is applied
        );
        // Return the updated category or null if not found
        return updatedCategory;
    }
    catch (error) {
        // Re-throw the error to handle it in the calling function
        throw new Error(error instanceof Error ? error.message : "Error updating category");
    }
});
exports.editCategoryInDB = editCategoryInDB;
const deleteCategoryInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCategory = yield categoryModel_1.Category.findByIdAndDelete(id);
        return deletedCategory;
    }
    catch (error) {
        // Re-throw the error to handle it in the calling function
        throw new Error(error instanceof Error ? error.message : "Error deleting category");
    }
});
exports.deleteCategoryInDB = deleteCategoryInDB;
const addSubCategoryToDB = (newSubcategoryData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new subcategory instance using correct object property access
        const newSubcategory = new subCategoryModel_1.Subcategory({
            name: newSubcategoryData.name,
            categoryId: newSubcategoryData.categoryId,
        });
        // Save subcategory to the database
        const savedSubcategory = yield newSubcategory.save();
        // Return the saved subcategory
        return savedSubcategory;
    }
    catch (error) {
        // Throw the error to handle it in the calling function
        throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
    }
});
exports.addSubCategoryToDB = addSubCategoryToDB;
const listsubCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listedSubCategories = yield subCategoryModel_1.Subcategory.find();
        return listedSubCategories;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.listsubCategory = listsubCategory;
const editSubCategoryInDB = (id, editedSubCategoryData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedSubCategory = yield subCategoryModel_1.Subcategory.findByIdAndUpdate(id, {
            name: editedSubCategoryData.name,
            categoryId: editedSubCategoryData.categoryId,
        }, { new: true, runValidators: true });
        return updatedSubCategory;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error updating category");
    }
});
exports.editSubCategoryInDB = editSubCategoryInDB;
const deletesubCategoryInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedsubCategory = yield subCategoryModel_1.Subcategory.findByIdAndDelete(id);
        return deletedsubCategory;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error deleting category");
    }
});
exports.deletesubCategoryInDB = deletesubCategoryInDB;
// export const listProperties = async () =>{
//   try {
//     const listedProperties = await PropertyModel.find().populate('category');
//     return listedProperties;
//   }catch (error) {
//     throw new Error(
//       error instanceof Error ? error.message : "Error fetching properties"
//     );
//   }
// };
const propertyList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listedProperties = yield propertyModel_1.PropertyModel.find({
            is_verified: false,
        }).populate("vendor");
        return listedProperties;
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error fetching properties");
    }
});
exports.propertyList = propertyList;
const getPropertyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield propertyModel_1.PropertyModel.findById(id)
        .populate("vendor")
        .populate("category");
});
exports.getPropertyById = getPropertyById;
const updatePropertyVerificationStatus = (id, is_verified) => __awaiter(void 0, void 0, void 0, function* () {
    return yield propertyModel_1.PropertyModel.findByIdAndUpdate(id, { is_verified: true }, { new: true });
});
exports.updatePropertyVerificationStatus = updatePropertyVerificationStatus;
const addSubscriptionPlanToDB = (subscriptionData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert prioritySupport from boolean to 'yes' or 'no'
        const formattedSubscriptionData = Object.assign(Object.assign({}, subscriptionData), { prioritySupport: subscriptionData.prioritySupport ? "yes" : "no" });
        const newSubscriptionPlan = new subscriptionPlanModel_1.SubscriptionPlanModel(subscriptionData);
        const savedSubscriptionPlan = yield newSubscriptionPlan.save();
        return savedSubscriptionPlan;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.addSubscriptionPlanToDB = addSubscriptionPlanToDB;
const listSubscriptionPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listedSubscriptionPlans = yield subscriptionPlanModel_1.SubscriptionPlanModel.find();
        return listedSubscriptionPlans;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.listSubscriptionPlans = listSubscriptionPlans;
const changeToggleStatus = (planId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield subscriptionPlanModel_1.SubscriptionPlanModel.findByIdAndUpdate(planId, { status }, { new: true });
    }
    catch (error) {
        console.error("Error updating subscription plan status:", error);
        throw new Error("Failed to update status");
    }
});
exports.changeToggleStatus = changeToggleStatus;
