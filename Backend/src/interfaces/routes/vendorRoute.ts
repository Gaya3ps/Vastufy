import { Router } from "express";
import vendorController from "../controllers/vendorController";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: "licenseDocument", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

export { upload };

const uploadPropertyMedia = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (10MB per file)
}).fields([
  { name: "media", maxCount: 10 }, // Allow up to 10 files for 'media' (images/videos)
]);

export { uploadPropertyMedia };

const vendorRouter = Router();

vendorRouter.post("/signup", vendorController.vendorRegister);
vendorRouter.post("/otp-verification", vendorController.verifyOTP);
vendorRouter.post("/resend-otp", vendorController.resendOtp);
vendorRouter.post("/login", vendorController.vendorLogin);
vendorRouter.post("/uploadlicense", upload, vendorController.licenseUpload);
vendorRouter.get("/license/:id", vendorController.getLicenseNumber);
vendorRouter.put("/profile/:id", vendorController.updateVendorProfile);
vendorRouter.get("/categories", vendorController.getCategories);
vendorRouter.get("/subcategories", vendorController.getSubCategories);
vendorRouter.post(
  "/addproperty",
  uploadPropertyMedia,
  vendorController.addProperty
);
vendorRouter.get("/properties/:vendorId", vendorController.getProperties);
vendorRouter.get("/bookings/:vendorId", vendorController.getBookings);
vendorRouter.put(
  "/edit-property/:propertyId",
  uploadPropertyMedia,
  vendorController.updateProperty
);
vendorRouter.get("/edit-properties/:id", vendorController.getPropertyById);
vendorRouter.put("/accept-booking/:bookingId",vendorController.acceptBooking);
vendorRouter.put("/reject-booking/:bookingId",vendorController.rejectBooking);
vendorRouter.get("/chats/:chatId",vendorController.fetchChatHistory);
vendorRouter.get("/chatList/:vendorId",vendorController.fetchChatList);
vendorRouter.post("/chats/:chatId/send",vendorController.sendMessage);
vendorRouter.get("/getVendorSubscription/:vendorId",vendorController.getVendorSubscription);
vendorRouter.get("/listed-subscription-plans",vendorController.getListedSubscriptionPlans);
vendorRouter.post("/create-stripe-session",vendorController.buySubscription);
vendorRouter.post('/add-vendor-to-subscription', vendorController.addVendorToSubscription);
vendorRouter.get('/subscribed-plan/:vendorId', vendorController.subscribedPlan);











export default vendorRouter;
