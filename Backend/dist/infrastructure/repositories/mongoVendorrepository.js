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
exports.getSubscriptionRevenue = exports.getChatCountByVendor = exports.getPropertyCountByVendor = exports.getVendorCount = exports.fetchSubscribedPlan = exports.addVendorToSubscription = exports.listedSubscriptionPlans = exports.getVendorSubscription = exports.sendMessage = exports.fetchChatList = exports.fetchChatHistory = exports.rejectBookingStatus = exports.acceptBookingStatus = exports.getPropertyByIdFromDB = exports.updatePropertyInDB = exports.listBookings = exports.getAllProperties = exports.listProperty = exports.saveProperty = exports.listsubCategory = exports.listCategory = exports.updateVendorInDB = exports.vendorCount = exports.updateVendor = exports.getAllVendors = exports.getVendorLicense = exports.saveLicense = exports.verifyVendor = exports.getVendor = exports.getVendorbyEmail = exports.verifyVendorDb = exports.createVendor = void 0;
const vendorModel_1 = require("../database/dbModel/vendorModel");
const licenceModel_1 = require("../database/dbModel/licenceModel");
const categoryModel_1 = require("../database/dbModel/categoryModel");
const subCategoryModel_1 = require("../database/dbModel/subCategoryModel");
const propertyModel_1 = require("../database/dbModel/propertyModel");
const bookingModel_1 = require("../database/dbModel/bookingModel");
const chatModel_1 = __importDefault(require("../database/dbModel/chatModel"));
const messageModel_1 = __importDefault(require("../database/dbModel/messageModel"));
const subscriptionPlanModel_1 = require("../database/dbModel/subscriptionPlanModel");
const vendorSubscription_1 = require("../database/dbModel/vendorSubscription");
const moment_1 = __importDefault(require("moment"));
const createVendor = (vendorData, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("vendorData:", vendorData);
    const newVendor = new vendorModel_1.Vendor({
        name: vendorData.name,
        email: vendorData.email,
        password: hashedPassword,
        mobileNumber: vendorData.mobileNumber,
        is_verified: false,
    });
    console.log("newVendor:", newVendor);
    return yield newVendor.save();
});
exports.createVendor = createVendor;
const verifyVendorDb = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield vendorModel_1.Vendor.findOneAndUpdate({ email: email }, { $set: { otp_verified: true } }, { new: true });
    return vendorData;
});
exports.verifyVendorDb = verifyVendorDb;
const getVendorbyEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findOne({ email: email });
});
exports.getVendorbyEmail = getVendorbyEmail;
const getVendor = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findOne({ email: email });
});
exports.getVendor = getVendor;
const verifyVendor = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findOneAndUpdate({ email: email }, { $set: { is_verified: true } }, { new: true });
});
exports.verifyVendor = verifyVendor;
const saveLicense = (licenseData) => __awaiter(void 0, void 0, void 0, function* () {
    const license = new licenceModel_1.LicenseModel(licenseData);
    return yield license.save();
});
exports.saveLicense = saveLicense;
const getVendorLicense = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield licenceModel_1.LicenseModel.findOne({ email: email });
});
exports.getVendorLicense = getVendorLicense;
const getAllVendors = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("got vendor");
    // return await Vendor.find({ is_blocked:false},{_id:1,name:1,email:1,city:1,service:1,is_blocked:1})
    return yield vendorModel_1.Vendor.find({ is_verified: true, is_blocked: false }, { _id: 1, name: 1, email: 1, city: 1, service: 1, is_blocked: 1 });
});
exports.getAllVendors = getAllVendors;
const updateVendor = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, "😤😤😤");
    try {
        console.log("😤😤😤");
        const updatedVendor = yield vendorModel_1.Vendor.findByIdAndUpdate(id, data, {
            new: true,
        }).exec();
        console.log(updatedVendor, "😤😤😤");
        return updatedVendor;
    }
    catch (error) {
        throw new Error(`Failed to update vendor: ${error.message}`);
    }
});
exports.updateVendor = updateVendor;
const vendorCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorCount = yield vendorModel_1.Vendor.countDocuments();
        console.log(vendorCount, "vendorcounts");
        return vendorCount;
    }
    catch (error) {
        throw new Error(`Failed to get vendor count: ${error.message}`);
    }
});
exports.vendorCount = vendorCount;
const updateVendorInDB = (vendorId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProfile = yield vendorModel_1.Vendor.findByIdAndUpdate(vendorId, {
            name: updatedData.name,
            mobileNumber: updatedData.mobileNumber,
            address: updatedData.address,
        }, { new: true });
        return updatedProfile;
    }
    catch (error) {
        throw new Error(`Failed to update vendor: ${error.message}`);
    }
});
exports.updateVendorInDB = updateVendorInDB;
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
const saveProperty = (propertyData, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure that vendorId is treated correctly
        if (Array.isArray(vendorId)) {
            throw new Error("vendorId should not be an array.");
        }
        // Save the property with the vendor reference
        const newProperty = new propertyModel_1.PropertyModel(Object.assign(Object.assign({}, propertyData), { vendor: vendorId })); // Use 'vendor' instead of 'vendorId'
        const savedProperty = yield newProperty.save();
        yield vendorModel_1.Vendor.findByIdAndUpdate(vendorId, {
            $push: { properties: savedProperty._id },
            $inc: { listingsUsed: 1 }, // Add property to vendor's properties array
        });
        return savedProperty;
    }
    catch (error) {
        console.error("Error saving property:", error);
        throw new Error("Error saving property: " + error.message);
    }
});
exports.saveProperty = saveProperty;
const listProperty = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = yield vendorModel_1.Vendor.findById(vendorId).populate({
            path: "properties",
            populate: {
                path: "category", // Populate the category field
                model: "Category", // Assuming Category is the name of the category model
            },
        });
        return vendor;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.listProperty = listProperty;
const getAllProperties = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield propertyModel_1.PropertyModel.find({ is_verified: true }, // Only fetching verified properties
    {
        _id: 1,
        title: 1,
        description: 1,
        category: 1,
        subcategory: 1,
        availableStatus: 1,
        expectedPrice: 1,
        address: 1,
    }).populate("category", "name");
});
exports.getAllProperties = getAllProperties;
const listBookings = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find bookings by vendorId
        return yield bookingModel_1.BookingModel.find({ vendorId }).populate("propertyId userId vendorId"); // Populating related fields if needed
    }
    catch (error) {
        console.error("Error fetching bookings from database:", error);
        throw new Error("Database error while fetching bookings");
    }
});
exports.listBookings = listBookings;
const updatePropertyInDB = (propertyId, vendorId, propertyData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Find and update the property belonging to the vendor
        const updatedProperty = yield propertyModel_1.PropertyModel.findOneAndUpdate({ _id: propertyId, vendor: vendorId }, // Only update if property belongs to vendor
        { $set: propertyData }, // Update with new property data
        { new: true } // Return the updated document
        ).lean(); // Use lean() to get a plain JavaScript object
        if (!updatedProperty) {
            throw new Error("Property not found or does not belong to this vendor");
        }
        // Cast the updated document to PropertyDataResponse after ensuring required properties are present
        return Object.assign(Object.assign({}, updatedProperty), { saletype: (_a = updatedProperty.saleType) !== null && _a !== void 0 ? _a : "", ageofproperty: (_b = updatedProperty.ageOfProperty) !== null && _b !== void 0 ? _b : "" });
    }
    catch (error) {
        console.error("Error updating property:", error);
        throw new Error("Failed to update property: " + error.message);
    }
});
exports.updatePropertyInDB = updatePropertyInDB;
const getPropertyByIdFromDB = (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the property by its ID and populate category and subcategory details if they exist
        const property = yield propertyModel_1.PropertyModel.findById(propertyId)
            .populate("category", "name") // Populating category with only the name field
            .populate("subcategory", "name"); // Populating subcategory with only the name field
        if (!property) {
            throw new Error(`Property with ID ${propertyId} not found`);
        }
        return property;
    }
    catch (error) {
        console.error("Error fetching property by ID:", error);
        throw new Error("Failed to fetch property by ID");
    }
});
exports.getPropertyByIdFromDB = getPropertyByIdFromDB;
const acceptBookingStatus = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bookingModel_1.BookingModel.findByIdAndUpdate(bookingId, { status: "accepted" }, { new: true });
    }
    catch (error) {
        console.error("Error updating booking status to accepted:", error);
        throw error;
    }
});
exports.acceptBookingStatus = acceptBookingStatus;
const rejectBookingStatus = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bookingModel_1.BookingModel.findByIdAndUpdate(bookingId, { status: "rejected" }, { new: true });
});
exports.rejectBookingStatus = rejectBookingStatus;
const fetchChatHistory = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messageModel_1.default.find({ chatId })
            .sort({ timestamp: 1 }) // Sort by timestamp to display messages in chronological order
            .lean(); // Use lean for better performance if you’re only reading data
        return messages;
    }
    catch (error) {
        console.error("Error fetching chat history from database:", error);
        throw new Error("Failed to fetch chat history");
    }
});
exports.fetchChatHistory = fetchChatHistory;
const fetchChatList = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatList = yield chatModel_1.default.find({ users: vendorId })
            .populate({
            path: "users",
            match: { _id: { $ne: vendorId } }, // Exclude vendor from the populated users
            select: "name avatar", // Only include necessary fields
        })
            .populate("latestMessage", "message timestamp")
            .exec();
        return chatList;
    }
    catch (error) {
        console.error("Error fetching chat list from database:", error);
        throw new Error("Failed to fetch chat list");
    }
});
exports.fetchChatList = fetchChatList;
const sendMessage = (chatId, senderId, message, recipientId, senderModel, recipientModel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new message document
        const newMessage = yield messageModel_1.default.create({
            chatId,
            senderId,
            recipientId,
            senderModel,
            recipientModel,
            message,
            timestamp: new Date(),
        });
        console.log("Message saved to database:", newMessage);
        return newMessage;
    }
    catch (error) {
        console.error("Error saving message to database:", error);
        throw error;
    }
});
exports.sendMessage = sendMessage;
const getVendorSubscription = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all subscriptions associated with the vendor and populate each subscription's details
        const vendorSubscriptions = yield vendorSubscription_1.VendorSubscription.find({
            vendor: vendorId,
        }).populate("subscription");
        // Fetch vendor data regardless of subscription status
        const vendor = yield vendorModel_1.Vendor.findById(vendorId).select("maxListings listingsUsed");
        if (!vendor) {
            return null;
        }
        // Initialize the maxListings with the vendor's base maxListings
        let maxListings = vendor.maxListings;
        const listingsUsed = vendor.listingsUsed;
        // Sum up maxListings from all the vendor's subscriptions if they exist
        vendorSubscriptions.forEach((vendorSubscription) => {
            if (vendorSubscription.subscription) {
                maxListings += vendorSubscription.subscription.maxListings;
            }
        });
        return {
            maxListings,
            listingsUsed,
        };
    }
    catch (error) {
        console.error("Error in getVendorSubscription:", error);
        throw error;
    }
});
exports.getVendorSubscription = getVendorSubscription;
const listedSubscriptionPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query the database for subscription plans with status set to true
        const listedPlans = yield subscriptionPlanModel_1.SubscriptionPlanModel.find({ status: true });
        return listedPlans;
    }
    catch (error) {
        throw new Error("Failed to fetch listed subscription plans from the database");
    }
});
exports.listedSubscriptionPlans = listedSubscriptionPlans;
const addVendorToSubscription = (sessionId, subscriptionId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the vendor already has a subscription to avoid duplicates
        const existingSubscription = yield vendorSubscription_1.VendorSubscription.findOne({
            vendor: vendorId,
            subscription: subscriptionId,
        });
        if (existingSubscription) {
            console.log("Vendor already subscribed to this plan.");
            return {
                success: false,
                message: "Vendor already subscribed to this plan.",
            };
        }
        // Create a new VendorSubscription document
        const newVendorSubscription = new vendorSubscription_1.VendorSubscription({
            vendor: vendorId,
            subscription: subscriptionId,
            purchaseDate: new Date(),
            stripeSessionId: sessionId,
        });
        // Save the new subscription
        yield newVendorSubscription.save();
        return { success: true, message: "Subscription added successfully" };
    }
    catch (error) {
        console.error("Repository Error:", error);
        return { success: false, message: "Error saving subscription to database" };
    }
});
exports.addVendorToSubscription = addVendorToSubscription;
const fetchSubscribedPlan = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the subscription linked to the vendor, then populate the subscription details
        const subscribedPlan = yield vendorSubscription_1.VendorSubscription.findOne({
            vendor: vendorId,
        })
            .populate({
            path: "subscription",
            model: subscriptionPlanModel_1.SubscriptionPlanModel,
            select: "planName price features maxListings prioritySupport", // Only select needed fields
        })
            .exec();
        return subscribedPlan;
    }
    catch (error) {
        console.error("Error fetching subscribed plan from database:", error);
        throw error;
    }
});
exports.fetchSubscribedPlan = fetchSubscribedPlan;
const getVendorCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield vendorModel_1.Vendor.countDocuments(); // Returns only the count of vendors as a number
    }
    catch (error) {
        console.error("Error in getVendorCount:", error);
        throw error;
    }
});
exports.getVendorCount = getVendorCount;
const getPropertyCountByVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Count the number of properties that belong to the given vendorId
        const count = yield propertyModel_1.PropertyModel.countDocuments({ vendor: vendorId });
        return count; // Return the count of properties
    }
    catch (error) {
        console.error("Error fetching properties:", error);
        throw error; // Rethrow error to be handled by the controller
    }
});
exports.getPropertyCountByVendor = getPropertyCountByVendor;
const getChatCountByVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query the database to count the number of chats associated with the vendorId
        const count = yield chatModel_1.default.countDocuments({
            users: { $in: [vendorId] },
        });
        return count; // Return the chat count
    }
    catch (error) {
        console.error("Error fetching chat count:", error);
        throw error; // Rethrow the error to be handled by the interactor/controller
    }
});
exports.getChatCountByVendor = getChatCountByVendor;
const getSubscriptionRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define the date range (last 30 days)
        const endDate = (0, moment_1.default)().endOf("day").toDate(); // current date, end of the day
        const startDate = (0, moment_1.default)().subtract(30, "days").startOf("day").toDate(); // 30 days ago
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);
        const subscriptionRevenueData = yield vendorSubscription_1.VendorSubscription.find()
            .populate("subscription", "price")
            .exec();
        console.log("Subscription Revenue Data:", subscriptionRevenueData);
        return subscriptionRevenueData; // Return the complete data for the chart
    }
    catch (error) {
        console.error("Error fetching subscription revenue:", error);
        throw error;
    }
});
exports.getSubscriptionRevenue = getSubscriptionRevenue;
