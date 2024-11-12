import { Router } from "express";
import adminController from "../controllers/adminController";
import { protectAdmin } from "../frameworks/webserver/middleware/adminAuthMiddleware";

const adminRouter = Router();
adminRouter.post("/login", adminController.adminLogin);
adminRouter.get("/userlist", protectAdmin, adminController.getUsers);
adminRouter.patch("/blockUser/:userId", adminController.blockUser);
adminRouter.get("/verifyvendor", protectAdmin, adminController.getVendors);
adminRouter.get(
  "/vendorlist",
  protectAdmin,
  adminController.getVerifiedVendors
);
adminRouter.patch(
  "/blockVendor/:vendorId",
  protectAdmin,
  adminController.blockVendor
);
adminRouter.get("/vendor/:id", protectAdmin, adminController.getVendorById);
adminRouter.get(
  "/license/:email",
  protectAdmin,
  adminController.getLicenseByVendorEmail
);
adminRouter.patch(
  "/updatestatus/:id",
  protectAdmin,
  adminController.updateVendorVerificationStatus
);
adminRouter.patch(
  "/updateisverified/:vendorId",
  protectAdmin,
  adminController.updateIsVerified
);
adminRouter.post("/add-category", adminController.addCategory);
adminRouter.get("/categories", protectAdmin, adminController.getCategories);
adminRouter.put("/edit-category/:id", adminController.editCategory);
adminRouter.delete("/delete-category/:id", adminController.deleteCategory);
adminRouter.post("/add-subcategory", adminController.addSubCategory);
adminRouter.get(
  "/subcategories",
  protectAdmin,
  adminController.getSubCategories
);
adminRouter.put("/edit-subcategory/:id", adminController.editSubCategory);
adminRouter.delete(
  "/delete-subcategory/:id",
  adminController.deleteSubCategory
);
adminRouter.get("/properties", adminController.getVerifiedProperties);
adminRouter.get(
  "/propertyverify",
  protectAdmin,
  adminController.verifyProperty
);
adminRouter.get(
  "/property/:propertyId",
  protectAdmin,
  adminController.getPropertyById
);

adminRouter.patch(
  "/updatepropertystatus/:id",
  protectAdmin,
  adminController.updatePropertyVerificationStatus
);

adminRouter.patch(
  "/updatepropertyisverified/:propertyId",
  protectAdmin,
  adminController.updatePropertyIsVerified
);

adminRouter.post(
  "/add-subscription-plan",
  protectAdmin,
  adminController.addSubscriptionPlan
);


adminRouter.get(
  "/getsubscriptionplans",
  protectAdmin,
  adminController.getSubscriptionPlans
);


export default adminRouter;
