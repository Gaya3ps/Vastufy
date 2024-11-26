"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPropertyMedia = exports.upload = void 0;
const express_1 = require("express");
const vendorController_1 = __importDefault(require("../controllers/vendorController"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
    { name: "licenseDocument", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
]);
exports.upload = upload;
const uploadPropertyMedia = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit (10MB per file)
}).fields([
    { name: "media", maxCount: 10 }, // Allow up to 10 files for 'media' (images/videos)
]);
exports.uploadPropertyMedia = uploadPropertyMedia;
const vendorRouter = (0, express_1.Router)();
vendorRouter.post("/signup", vendorController_1.default.vendorRegister);
vendorRouter.post("/otp-verification", vendorController_1.default.verifyOTP);
vendorRouter.post("/resend-otp", vendorController_1.default.resendOtp);
vendorRouter.post("/login", vendorController_1.default.vendorLogin);
vendorRouter.post("/uploadlicense", upload, vendorController_1.default.licenseUpload);
vendorRouter.get("/license/:id", vendorController_1.default.getLicenseNumber);
vendorRouter.put("/profile/:id", vendorController_1.default.updateVendorProfile);
vendorRouter.get("/categories", vendorController_1.default.getCategories);
vendorRouter.get("/subcategories", vendorController_1.default.getSubCategories);
vendorRouter.post("/addproperty", uploadPropertyMedia, vendorController_1.default.addProperty);
vendorRouter.get("/properties/:vendorId", vendorController_1.default.getProperties);
vendorRouter.get("/bookings/:vendorId", vendorController_1.default.getBookings);
vendorRouter.put("/edit-property/:propertyId", uploadPropertyMedia, vendorController_1.default.updateProperty);
vendorRouter.get("/edit-properties/:id", vendorController_1.default.getPropertyById);
vendorRouter.put("/accept-booking/:bookingId", vendorController_1.default.acceptBooking);
vendorRouter.put("/reject-booking/:bookingId", vendorController_1.default.rejectBooking);
vendorRouter.get("/chats/:chatId", vendorController_1.default.fetchChatHistory);
vendorRouter.get("/chatList/:vendorId", vendorController_1.default.fetchChatList);
vendorRouter.post("/chats/:chatId/send", vendorController_1.default.sendMessage);
vendorRouter.get("/getVendorSubscription/:vendorId", vendorController_1.default.getVendorSubscription);
vendorRouter.get("/listed-subscription-plans", vendorController_1.default.getListedSubscriptionPlans);
vendorRouter.post("/create-stripe-session", vendorController_1.default.buySubscription);
vendorRouter.post('/add-vendor-to-subscription', vendorController_1.default.addVendorToSubscription);
vendorRouter.get('/subscribed-plan/:vendorId', vendorController_1.default.subscribedPlan);
vendorRouter.get('/vendorCount', vendorController_1.default.getVendorCount);
vendorRouter.get('/propertyCount/:vendorId', vendorController_1.default.getPropertyCount);
vendorRouter.get('/chatCount/:vendorId', vendorController_1.default.getChatCount);
vendorRouter.get('/subscriptionRevenue', vendorController_1.default.getSubscriptionRevenue);
exports.default = vendorRouter;
