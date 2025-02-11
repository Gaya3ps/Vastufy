"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminAuthMiddleware_1 = require("../frameworks/webserver/middleware/adminAuthMiddleware");
const adminRouter = (0, express_1.Router)();
adminRouter.post("/login", adminController_1.default.adminLogin);
adminRouter.get("/userlist", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getUsers);
adminRouter.patch("/blockUser/:userId", adminController_1.default.blockUser);
adminRouter.get("/verifyvendor", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getVendors);
adminRouter.get("/vendorlist", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getVerifiedVendors);
adminRouter.patch("/blockVendor/:vendorId", adminAuthMiddleware_1.protectAdmin, adminController_1.default.blockVendor);
adminRouter.get("/vendor/:id", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getVendorById);
adminRouter.get("/license/:email", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getLicenseByVendorEmail);
adminRouter.patch("/updatestatus/:id", adminAuthMiddleware_1.protectAdmin, adminController_1.default.updateVendorVerificationStatus);
adminRouter.patch("/updateisverified/:vendorId", adminAuthMiddleware_1.protectAdmin, adminController_1.default.updateIsVerified);
adminRouter.post("/add-category", adminController_1.default.addCategory);
adminRouter.get("/categories", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getCategories);
adminRouter.put("/edit-category/:id", adminController_1.default.editCategory);
adminRouter.delete("/delete-category/:id", adminController_1.default.deleteCategory);
adminRouter.post("/add-subcategory", adminController_1.default.addSubCategory);
adminRouter.get("/subcategories", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getSubCategories);
adminRouter.put("/edit-subcategory/:id", adminController_1.default.editSubCategory);
adminRouter.delete("/delete-subcategory/:id", adminController_1.default.deleteSubCategory);
adminRouter.get("/properties", adminController_1.default.getVerifiedProperties);
adminRouter.get("/propertyverify", adminAuthMiddleware_1.protectAdmin, adminController_1.default.verifyProperty);
adminRouter.get("/property/:propertyId", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getPropertyById);
adminRouter.patch("/updatepropertystatus/:id", adminAuthMiddleware_1.protectAdmin, adminController_1.default.updatePropertyVerificationStatus);
adminRouter.patch("/updatepropertyisverified/:propertyId", adminAuthMiddleware_1.protectAdmin, adminController_1.default.updatePropertyIsVerified);
adminRouter.post("/add-subscription-plan", adminAuthMiddleware_1.protectAdmin, adminController_1.default.addSubscriptionPlan);
adminRouter.get("/getsubscriptionplans", adminAuthMiddleware_1.protectAdmin, adminController_1.default.getSubscriptionPlans);
adminRouter.put("/subscriptionplans/status", adminAuthMiddleware_1.protectAdmin, adminController_1.default.toggleStatus);
exports.default = adminRouter;
