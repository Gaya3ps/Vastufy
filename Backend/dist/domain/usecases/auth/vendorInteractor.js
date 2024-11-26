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
const hashPassword_1 = require("../../helper/hashPassword");
const mongoVendorrepository_1 = require("../../../infrastructure/repositories/mongoVendorrepository");
const console_1 = require("console");
const otpUtils_1 = require("../../../utils/otpUtils");
const emailUtils_1 = require("../../../utils/emailUtils");
const mongoUserRepository_1 = require("../../../infrastructure/repositories/mongoUserRepository");
const jwtHelper_1 = require("../../helper/jwtHelper");
const s3Uploader_1 = require("../../../utils/s3Uploader");
const vendorModel_1 = require("../../../infrastructure/database/dbModel/vendorModel");
const mongoAdminRepository_1 = require("../../../infrastructure/repositories/mongoAdminRepository");
exports.default = {
    registerVendor: (vendorData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Vendor data:", vendorData);
        try {
            if (!vendorData.email ||
                !vendorData.name ||
                !vendorData.password ||
                !vendorData.mobileNumber) {
                throw new Error("Vendor data is incomplete");
            }
            const existingVendor = yield (0, mongoVendorrepository_1.getVendorbyEmail)(vendorData.email);
            console.log("Existing Vendor:", existingVendor);
            if (existingVendor) {
                if (existingVendor.is_verified) {
                    throw new Error("Vendor already exists");
                }
                if (!existingVendor.otp_verified) {
                    console.log("Generating OTP...");
                    const otp = (0, otpUtils_1.generateOTP)();
                    console.log("Generated OTP:", otp);
                    const generatedAt = Date.now();
                    console.log("Sending OTP email...");
                    yield (0, emailUtils_1.sendOTPEmail)(vendorData.email, otp, vendorData.name);
                    console.log("Saving OTP...");
                    const savedOtp = yield (0, mongoUserRepository_1.saveOtp)(vendorData.email, otp, generatedAt);
                    console.log("OTP saved successfully:", savedOtp);
                    return {
                        message: "OTP generated successfully",
                        otpGenerated: true,
                        redirectTo: "/vendor/otp-verification",
                    };
                }
                else {
                    const getLicense = yield (0, mongoVendorrepository_1.getVendorLicense)(vendorData.email);
                    console.log("Vendor License:", getLicense);
                    if ((getLicense === null || getLicense === void 0 ? void 0 : getLicense.email) === vendorData.email) {
                        return {
                            message: "Your license is under verification. Please wait for approval.",
                            redirectTo: "/vendor/success",
                        };
                    }
                    console.log("Redirecting to license upload...");
                    return {
                        message: "Registration success",
                        redirectTo: "/vendor/uploadlicense",
                    };
                }
            }
            console.log("Generating OTP...");
            const otp = (0, otpUtils_1.generateOTP)();
            console.log("Generated OTP:", otp);
            const generatedAt = Date.now();
            console.log("Sending OTP email...");
            yield (0, emailUtils_1.sendOTPEmail)(vendorData.email, otp, vendorData.name);
            console.log("Saving OTP...");
            const savedOtp = yield (0, mongoUserRepository_1.saveOtp)(vendorData.email, otp, generatedAt);
            console.log("OTP saved successfully:", savedOtp);
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(vendorData.password);
            const savedVendor = yield (0, mongoVendorrepository_1.createVendor)(Object.assign({}, vendorData), hashedPassword);
            console.log("Saved Vendor:", savedVendor);
            return {
                message: "Vendor registered successfully",
                vendor: savedVendor,
                redirectTo: "/vendor/otp-verification",
            };
        }
        catch (error) {
            console.error("Error during vendor registration:", error);
            throw new Error(error.message || "Registration failed");
        }
    }),
    verifyVendor: (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("body ", data);
        if (!data.otp) {
            throw new Error("no otp");
        }
        const storedOTP = yield (0, mongoUserRepository_1.getStoredOTP)(data.email);
        console.log("1111111111111", storedOTP);
        if (!storedOTP || storedOTP.otp !== data.otp) {
            console.log("invalid otp");
            throw new Error("Invalid Otp");
        }
        const otpGeneratedAt = storedOTP.generatedAt;
        const currentTime = Date.now();
        const otpAge = currentTime - otpGeneratedAt.getTime();
        const expireOTP = 1 * 60 * 1000;
        if (otpAge > expireOTP) {
            throw new Error("OTP Expired");
        }
        return yield (0, mongoVendorrepository_1.verifyVendorDb)(data.email);
    }),
    resendOtp: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newOtp = yield (0, otpUtils_1.generateOTP)();
            const generatedAt = Date.now();
            const vendors = yield (0, mongoVendorrepository_1.getVendorbyEmail)(email);
            if (vendors && vendors.name) {
                yield (0, emailUtils_1.sendOTPEmail)(email, newOtp, vendors.name);
                (0, console_1.log)("newOtp:", newOtp);
                yield (0, mongoUserRepository_1.saveOtp)(email, newOtp, generatedAt);
            }
            else {
                throw new Error("Please signup again");
            }
        }
        catch (error) {
            throw new Error("Failed to resend otp");
        }
    }),
    loginVendor: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const existingVendor = yield (0, mongoVendorrepository_1.getVendorbyEmail)(email);
        console.log("fffffffff", existingVendor);
        const vendors = yield (0, mongoVendorrepository_1.getVendor)(email);
        if (!existingVendor || !existingVendor.password) {
            throw new Error("User not found");
        }
        const isValid = yield hashPassword_1.Encrypt.comparePassword(password, existingVendor.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }
        if (!vendors) {
            throw new Error("vendor is not found");
        }
        if (!existingVendor.is_verified) {
            throw new Error("Account is not verified");
        }
        if (existingVendor.is_blocked) {
            throw new Error("Account is blocked");
        }
        const role = "vendor";
        const token = yield (0, jwtHelper_1.generateToken)(existingVendor.id, email, role);
        (0, console_1.log)("tokenvendor", token);
        const vendor = {
            id: existingVendor.id,
            name: existingVendor.name,
            email: existingVendor.email,
            mobileNumber: existingVendor.mobileNumber,
        };
        return { token, vendor };
    }),
    uploadVendorLicense: (licenseData) => __awaiter(void 0, void 0, void 0, function* () {
        const { licenseNumber, email, issueDate, expiryDate, licenseDocument } = licenseData;
        // Upload the license document to S3 and get the document URL
        const licenseDocumentResult = yield (0, s3Uploader_1.uploadToS3)(licenseDocument);
        const licenseDocumentUrl = licenseDocumentResult.Location;
        // Create the complete license data object
        const completeLicenseData = {
            licenseNumber,
            email,
            issueDate,
            expiryDate,
            licenseDocumentUrl,
        };
        // Save the license data to the License model
        const savedLicense = yield (0, mongoVendorrepository_1.saveLicense)(completeLicenseData);
        // Once the license is saved, update the corresponding vendor with the license ID
        yield vendorModel_1.Vendor.findOneAndUpdate({ email: email }, // Find the vendor by email
        { license: savedLicense._id }, // Update the vendor's license field with the saved License ID
        { new: true } // Return the updated document
        );
        console.log(savedLicense, "License saved and associated with vendor.");
        return savedLicense;
    }),
    updateVendorProfile: (vendorId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!updatedData.name ||
                !updatedData.mobileNumber ||
                !updatedData.address) {
                throw new Error("Name , Mobile number and Address are required");
            }
            const updatedVendors = yield (0, mongoVendorrepository_1.updateVendorInDB)(vendorId, updatedData);
            return updatedVendors;
        }
        catch (error) {
            throw new Error("Failed to update vendor profile");
        }
    }),
    getCategories: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categoryList = yield (0, mongoVendorrepository_1.listCategory)();
            return categoryList;
        }
        catch (error) { }
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
    addVendorProperty: (propertyData, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { propertyType, expectedPrice, title, description, category, subcategory, ownershipStatus, availableStatus, saletype: saleType, // Correct to match your model
            ageofproperty: ageOfProperty, // Correct to match your model
            carpetArea, builtUpArea, plotArea, washrooms, totalFloors, floorNo, parking, district, city, locality, zip, address, landmark, bedrooms, balconies, furnishingStatus, powerBackup, roadAccessibility, locationAdvantages, media, // Media files (images/videos)
            amenities, // List of amenities
             } = propertyData;
            // Step 1: Upload media files to S3 and get their URLs
            const mediaUrls = [];
            for (const file of media) {
                const mediaUploadResult = yield (0, s3Uploader_1.uploadToS3)(file);
                mediaUrls.push(mediaUploadResult.Location); // Store the URLs of uploaded media files
            }
            // Step 2: Construct and save the property data
            const newProperty = {
                propertyType,
                expectedPrice,
                title,
                description,
                category,
                subcategory,
                ownershipStatus,
                availableStatus,
                saleType, // Match schema
                ageOfProperty, // Match schema
                carpetArea,
                builtUpArea,
                plotArea,
                washrooms,
                totalFloors,
                floorNo,
                parking,
                district,
                city,
                locality,
                zip,
                address,
                landmark,
                bedrooms,
                balconies,
                furnishingStatus,
                powerBackup,
                roadAccessibility,
                locationAdvantages,
                mediaUrls, // URLs of uploaded media files
                amenities, // Amenities list
                vendor: vendorId, // Associate property with vendor
                createdAt: new Date(),
            };
            // Step 3: Save the property using the repository function
            const savedProperty = yield (0, mongoVendorrepository_1.saveProperty)(newProperty, vendorId);
            // Step 4: Create and return the PropertyDataResponse object
            const propertyResponse = {
                propertyType: savedProperty.propertyType,
                expectedPrice: savedProperty.expectedPrice,
                title: savedProperty.title,
                description: savedProperty.description,
                category: savedProperty.category,
                subcategory: savedProperty.subcategory,
                ownershipStatus: savedProperty.ownershipStatus,
                availableStatus: savedProperty.availableStatus,
                saletype: savedProperty.saleType, // Match response format
                ageofproperty: savedProperty.ageOfProperty, // Match response format
                carpetArea: savedProperty.carpetArea,
                builtUpArea: savedProperty.builtUpArea,
                plotArea: savedProperty.plotArea,
                washrooms: savedProperty.washrooms,
                totalFloors: savedProperty.totalFloors,
                floorNo: savedProperty.floorNo,
                parking: savedProperty.parking,
                district: savedProperty.district,
                city: savedProperty.city,
                locality: savedProperty.locality,
                zip: savedProperty.zip,
                address: savedProperty.address,
                landmark: savedProperty.landmark,
                bedrooms: savedProperty.bedrooms,
                balconies: savedProperty.balconies,
                furnishingStatus: savedProperty.furnishingStatus,
                powerBackup: savedProperty.powerBackup,
                roadAccessibility: savedProperty.roadAccessibility,
                locationAdvantages: savedProperty.locationAdvantages,
                mediaUrls: savedProperty.mediaUrls, // Include uploaded media URLs
                amenities: savedProperty.amenities, // Include amenities
                createdAt: savedProperty.createdAt, // Date property was created
            };
            console.log(savedProperty, "Property saved and associated with vendor.");
            return propertyResponse;
        }
        catch (error) {
            console.error("Error in addVendorProperty:", error);
            throw new Error("Error adding property: " + error.message);
        }
    }),
    getPropertyList: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const propertyList = yield (0, mongoVendorrepository_1.listProperty)(vendorId);
            return propertyList;
        }
        catch (error) {
            console.error("Error in addVendorProperty:", error);
            throw new Error("Error adding property: " + error.message);
        }
    }),
    getBookingList: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call the repository to get the bookings for the vendor
            const bookingList = yield (0, mongoVendorrepository_1.listBookings)(vendorId);
            console.log(bookingList, "aaaaaaaaaaaaaaaaa");
            return bookingList;
        }
        catch (error) {
            console.error("Error in interactor:", error);
            throw new Error("Failed to get bookings");
        }
    }),
    updateVendorProperty: (propertyId, vendorId, propertyData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { propertyType, expectedPrice, title, description, category, subcategory, ownershipStatus, availableStatus, saletype, // Use 'saletype' as defined in PropertyDataResponse
            ageofproperty, // Use 'ageofproperty' as defined in PropertyDataResponse
            carpetArea, builtUpArea, plotArea, washrooms, totalFloors, floorNo, parking, district, city, locality, zip, address, landmark, bedrooms, balconies, furnishingStatus, powerBackup, roadAccessibility, locationAdvantages, media, amenities, } = propertyData;
            // Step 1: Upload media files to S3 and get their URLs if new media files are provided
            const mediaUrls = [];
            if (media && media.length > 0) {
                for (const file of media) {
                    const mediaUploadResult = yield (0, s3Uploader_1.uploadToS3)(file);
                    mediaUrls.push(mediaUploadResult.Location);
                }
            }
            // Step 2: Construct updated property data
            const updatedPropertyData = Object.assign({ propertyType,
                expectedPrice,
                title,
                description,
                category,
                subcategory,
                ownershipStatus,
                availableStatus,
                saletype, // Use 'saletype' as is
                ageofproperty, // Use 'ageofproperty' as is
                carpetArea,
                builtUpArea,
                plotArea,
                washrooms,
                totalFloors,
                floorNo,
                parking,
                district,
                city,
                locality,
                zip,
                address,
                landmark,
                bedrooms,
                balconies,
                furnishingStatus,
                powerBackup,
                roadAccessibility, locationAdvantages: locationAdvantages || [], amenities: amenities || [] }, (mediaUrls.length > 0 && { mediaUrls }));
            // Step 3: Update the property in the database
            const updatedProperty = yield (0, mongoVendorrepository_1.updatePropertyInDB)(propertyId, vendorId, updatedPropertyData);
            // Check if updatePropertyInDB returned null
            if (!updatedProperty) {
                throw new Error("Property not found or does not belong to this vendor");
            }
            // Step 4: Create and return the PropertyDataResponse object
            const propertyResponse = {
                propertyType: updatedProperty.propertyType,
                expectedPrice: updatedProperty.expectedPrice,
                title: updatedProperty.title,
                description: updatedProperty.description,
                category: updatedProperty.category,
                subcategory: updatedProperty.subcategory,
                ownershipStatus: updatedProperty.ownershipStatus,
                availableStatus: updatedProperty.availableStatus,
                saletype: updatedProperty.saletype, // Use 'saletype' as is
                ageofproperty: updatedProperty.ageofproperty, // Use 'ageofproperty' as is
                carpetArea: updatedProperty.carpetArea,
                builtUpArea: updatedProperty.builtUpArea,
                plotArea: updatedProperty.plotArea,
                washrooms: updatedProperty.washrooms,
                totalFloors: updatedProperty.totalFloors,
                floorNo: updatedProperty.floorNo,
                parking: updatedProperty.parking,
                district: updatedProperty.district,
                city: updatedProperty.city,
                locality: updatedProperty.locality,
                zip: updatedProperty.zip,
                address: updatedProperty.address,
                landmark: updatedProperty.landmark,
                bedrooms: updatedProperty.bedrooms,
                balconies: updatedProperty.balconies,
                furnishingStatus: updatedProperty.furnishingStatus,
                powerBackup: updatedProperty.powerBackup,
                roadAccessibility: updatedProperty.roadAccessibility,
                locationAdvantages: updatedProperty.locationAdvantages,
                mediaUrls: updatedProperty.mediaUrls,
                amenities: updatedProperty.amenities,
                createdAt: updatedProperty.createdAt,
            };
            console.log("Property updated successfully:", updatedProperty);
            return propertyResponse;
        }
        catch (error) {
            console.error("Error in updateVendorProperty:", error);
            throw new Error("Error updating property: " + error.message);
        }
    }),
    getPropertyById: (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call the repository function to get the property by ID
            const property = yield (0, mongoVendorrepository_1.getPropertyByIdFromDB)(propertyId);
            return property;
        }
        catch (error) {
            console.error("Error in getPropertyById:", error);
            throw new Error("Error fetching property by ID");
        }
    }),
    updateBookingStatusAccept: (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoVendorrepository_1.acceptBookingStatus)(bookingId);
        }
        catch (error) {
            console.error("Error in updateBookingStatusAccept:", error);
            throw error;
        }
    }),
    updateBookingStatusReject: (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoVendorrepository_1.rejectBookingStatus)(bookingId);
        }
        catch (error) {
            console.error("Error rejecting booking:", error);
            throw error;
        }
    }),
    getChatHistory: (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chatHistory = yield (0, mongoVendorrepository_1.fetchChatHistory)(chatId);
            return chatHistory;
        }
        catch (error) {
            console.error("Error in interactor fetching chat history:", error);
            throw new Error("Failed to fetch chat history");
        }
    }),
    getChatList: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoVendorrepository_1.fetchChatList)(vendorId);
        }
        catch (error) {
            console.error("Error in fetching chat list from interactor:", error);
            throw new Error("Failed to get chat list");
        }
    }),
    sendMessage: (chatId, senderId, message, recipientId, senderModel, recipientModel) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messageSent = yield (0, mongoVendorrepository_1.sendMessage)(chatId, senderId, message, recipientId, senderModel, recipientModel);
            return messageSent;
        }
        catch (error) {
            console.error("Error in sending message through interactor:", error);
            throw new Error("Failed to send message");
        }
    }),
    vendorSubscription: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const subscription = yield (0, mongoVendorrepository_1.getVendorSubscription)(vendorId);
            if (!subscription) {
                return null;
            }
            return {
                maxListings: subscription.maxListings,
                listingsUsed: subscription.listingsUsed,
            };
        }
        catch (error) {
            console.error("Error in vendorSubscription interactor:", error);
            throw error;
        }
    }),
    listedSubscriptionPlans: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Query the database for plans where status is true (listed)
            const listedPlans = yield (0, mongoVendorrepository_1.listedSubscriptionPlans)();
            return listedPlans;
        }
        catch (error) {
            throw new Error("Failed to fetch listed subscription plans");
        }
    }),
    addVendorToSubscription: (sessionId, subscriptionId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call the repository to add the vendor to the subscription
            const updateResult = yield (0, mongoVendorrepository_1.addVendorToSubscription)(sessionId, subscriptionId, vendorId);
            // If the result indicates a successful save
            if (updateResult.success) {
                return { success: true, message: updateResult.message };
            }
            else {
                return {
                    success: false,
                    message: updateResult.message || "Could not add vendor",
                };
            }
        }
        catch (error) {
            console.error("Interactor Error:", error);
            return {
                success: false,
                message: "Interactor error while adding vendor to subscription",
            };
        }
    }),
    listSubscribedPlan: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoVendorrepository_1.fetchSubscribedPlan)(vendorId);
        }
        catch (error) {
            console.error("Error in interactor while fetching subscribed plan:", error);
            throw error;
        }
    }),
    vendorCount: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoVendorrepository_1.getVendorCount)(); // Returns only the count of vendors as a number
        }
        catch (error) {
            console.error("Error in vendorCount interactor:", error);
            throw error;
        }
    }),
    propertyCount: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoVendorrepository_1.getPropertyCountByVendor)(vendorId); // Fetch count from the database
        }
        catch (error) {
            console.error("Error fetching property count:", error);
            throw error;
        }
    }),
    chatCount: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoVendorrepository_1.getChatCountByVendor)(vendorId); // Call chat service to get chat count
        }
        catch (error) {
            console.error("Error fetching chat count:", error);
            throw error;
        }
    }),
    subscriptionRevenue: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const revenueData = yield (0, mongoVendorrepository_1.getSubscriptionRevenue)();
            return revenueData;
        }
        catch (error) {
            console.error("Error in subscription revenue interactor:", error);
            throw error;
        }
    })
};
