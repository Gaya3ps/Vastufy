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
const otpUtils_1 = require("../../../utils/otpUtils");
const mongoUserRepository_1 = require("../../../infrastructure/repositories/mongoUserRepository");
const hashPassword_1 = require("../../helper/hashPassword");
const emailUtils_1 = require("../../../utils/emailUtils");
const mongoUserRepository_2 = require("../../../infrastructure/repositories/mongoUserRepository");
const jwtHelper_1 = require("../../helper/jwtHelper");
const console_1 = require("console");
function createError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}
exports.default = {
    registerUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!userData.email || !userData.name) {
                throw new Error("user data undefined");
            }
            const existingUser = yield (0, mongoUserRepository_1.checkExistingUser)(userData.email, userData.name);
            if (existingUser && existingUser.is_verified == true) {
                throw new Error("User already exists");
            }
            const otp = yield (0, otpUtils_1.generateOTP)();
            console.log("otpppppppp", otp);
            const generatedAt = Date.now();
            yield (0, emailUtils_1.sendOTPEmail)(userData.email, otp, userData.name);
            const savedOtp = yield (0, mongoUserRepository_1.saveOtp)(userData.email, otp, generatedAt);
            const password = userData.password;
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(password);
            const savedUser = yield (0, mongoUserRepository_1.createUser)(userData, hashedPassword);
            console.log(savedUser);
            return savedUser;
        }
        catch (error) {
            throw error;
        }
    }),
    verifyUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("body ", data);
        if (!data.otp) {
            throw new Error("no otp");
        }
        const storedOTP = yield (0, mongoUserRepository_2.getStoredOTP)(data.email);
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
        return yield (0, mongoUserRepository_1.verifyUserDb)(data.email);
    }),
    otpResend: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newotp = yield (0, otpUtils_1.generateOTP)();
            const generatedAt = Date.now();
            const users = yield (0, mongoUserRepository_1.getUserbyEMail)(email);
            if (users && users.name) {
                yield (0, emailUtils_1.sendOTPEmail)(email, newotp, users.name);
                console.log("newOtp:", newotp);
                yield (0, mongoUserRepository_1.saveOtp)(email, newotp, generatedAt);
            }
            else {
                throw new Error("Please signup again");
            }
        }
        catch (error) {
            throw new Error("Failed to resend otp");
        }
    }),
    loginUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield (0, mongoUserRepository_1.getUserbyEMail)(email);
        if (!existingUser || !existingUser.password) {
            throw new Error("User not found");
        }
        const isValid = yield hashPassword_1.Encrypt.comparePassword(password, existingUser.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }
        if (existingUser && existingUser.is_blocked) {
            throw new Error("Account is Blocked");
        }
        if (existingUser.is_verified == false) {
            throw new Error(`User is not verified.Register!`);
        }
        const role = "user";
        const { token, refreshToken } = yield (0, jwtHelper_1.generateToken)(existingUser.id, email, role);
        const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            isBlocked: existingUser.is_blocked,
        };
        return { token, user, refreshToken };
    }),
    googleUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const savedUser = yield (0, mongoUserRepository_1.googleUser)(userData);
            console.log("saveduser:", savedUser);
            if (savedUser) {
                const user = {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                };
                console.log("User Object:", user);
                if (!savedUser.is_verified) {
                    savedUser.is_verified = true; // Set isVerified to true for Google users
                    yield savedUser.save(); // Save the user if any changes were made
                }
                if (!savedUser._id || !savedUser.email) {
                    throw new Error("User ID or email is undefined");
                }
                if (savedUser.is_blocked) {
                    throw createError("Account is Blocked", 403); // Forbidden
                }
                const role = "user";
                let { token, refreshToken } = (0, jwtHelper_1.generateToken)(savedUser.id, savedUser.email, role);
                (0, console_1.log)(token, refreshToken, "refresh");
                return { user, token, refreshToken };
            }
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }),
    forgotPassword: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, mongoUserRepository_1.getUserbyEMail)(email);
        if (!user) {
            throw new Error("User not found");
        }
        // Generate reset token (e.g., JWT or random token)
        const resetToken = (0, jwtHelper_1.generateResetToken)(email); // Ensure the User model has a method to generate this token
        console.log(resetToken, "this is rest token");
        // Save reset token and expiration time to the user in the database
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        yield user.save();
        // Send password reset email
        yield (0, emailUtils_1.sendPasswordResetEmail)(user.email || "", resetToken, user.name || "User");
        return { message: "Password reset email sent" };
    }),
    resetPassword: (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        // Find user by reset token
        const user = yield (0, mongoUserRepository_1.getUserByResetToken)(token);
        if (!user) {
            throw new Error("Invalid or expired reset token");
        }
        // Check if the reset token is still valid
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw new Error("Reset token has expired");
        }
        // Validate token (optional, if you're using JWT or other signed tokens)
        const isTokenValid = (0, jwtHelper_1.validateResetToken)(token, user.email);
        if (!isTokenValid) {
            throw new Error("Invalid reset token");
        }
        // Hash the new password using your existing Encrypt.cryptPassword method
        const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(newPassword);
        // Update the user's password in the database
        yield (0, mongoUserRepository_1.updateUserPassword)(user.id, hashedPassword);
        // Clear reset token and expiration
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        yield user.save();
        return { message: "Password has been reset successfully" };
    }),
    getPropertyList: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const propertyList = yield (0, mongoUserRepository_1.listProperty)();
            return propertyList;
        }
        catch (error) {
            console.error("Error in addVendorProperty:", error);
            throw new Error("Error adding property: " + error.message);
        }
    }),
    fetchPropertyDetailsById: (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const property = yield (0, mongoUserRepository_1.getPropertyDetailsById)(propertyId);
            return property;
        }
        catch (error) {
            throw new Error("Failed to get property");
        }
    }),
    bookings: (propertyId, userId, vendorId, visitDate, timeSlot) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newBooking = yield (0, mongoUserRepository_1.getBookings)(propertyId, userId, vendorId, visitDate, timeSlot);
            return newBooking;
        }
        catch (error) {
            throw new Error("Failed to save booking");
        }
    }),
    fetchProperties: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const property = yield (0, mongoUserRepository_1.getProperties)();
            return property;
        }
        catch (error) {
            console.error("Error fetching vendor by id:", error);
            throw new Error("Failed to fetch vendor");
        }
    }),
    fetchBookings: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookings = yield (0, mongoUserRepository_1.getBookingDetails)(userId);
            return bookings;
        }
        catch (error) {
            console.error('Error in fetchBookings:', error);
            throw error;
        }
    }),
    initiateChatSession: (userId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoUserRepository_1.createOrFetchChatSession)([userId, vendorId]);
        }
        catch (error) {
            console.error('Failed to initiate chat session:', error);
            throw new Error('Failed to initiate chat session');
        }
    }),
    getAllChats: (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoUserRepository_1.fetchChats)(chatId);
        }
        catch (error) {
            console.error('Error in fetching chat history:', error);
            throw new Error('Failed to fetch chat history');
        }
    }),
    sendMessageToChat: (chatId, senderId, message, recipientId, senderModel, // Add senderModel as a parameter
    recipientModel // Add recipientModel as a parameter
    ) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Pass all parameters to addMessageToChat
            return yield (0, mongoUserRepository_1.addMessageToChat)(chatId, senderId, message, recipientId, senderModel, recipientModel);
        }
        catch (error) {
            console.error("Error in sendMessage interactor:", error);
            throw new Error("Failed to send message");
        }
    }),
    getChatLists: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Interactor: Getting chat list for user ID:", userId);
        try {
            return yield (0, mongoUserRepository_1.getChats)(userId);
        }
        catch (error) {
            console.error('Error in fetching chat list from interactor:', error);
            throw new Error('Failed to fetch chat list');
        }
    }),
    getBookings: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookings = yield (0, mongoUserRepository_1.getAllBookings)();
            // Define `acc` with an explicit type for TypeScript compatibility
            const bookingCounts = bookings.reduce((acc, booking) => {
                const date = booking.visitDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
                acc[date] = (acc[date] || 0) + 1; // Increment count for each date
                return acc;
            }, {});
            // Transform the booking counts to an array of objects for easier chart handling
            const formattedData = Object.keys(bookingCounts).map(date => ({
                date,
                count: bookingCounts[date]
            }));
            return formattedData;
        }
        catch (error) {
            console.error("Error in getBookings interactor:", error);
            throw error;
        }
    }),
    userCount: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allUsersCount = yield (0, mongoUserRepository_1.getUsersCount)();
            return allUsersCount;
        }
        catch (error) {
            console.error("Error in getUsers interactor:", error);
            throw error;
        }
    }),
    getPropertyStats: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const propertyStats = yield (0, mongoUserRepository_1.getPropertyStats)();
            return propertyStats;
        }
        catch (error) {
            console.error("Error in interactor while fetching property stats:", error);
            throw error;
        }
    })
};
