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
const userInteractor_1 = __importDefault(require("../../domain/usecases/auth/userInteractor"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoUserRepository_1 = require("../../infrastructure/repositories/mongoUserRepository");
const jwtHelper_1 = require("../../domain/helper/jwtHelper");
const userModel_1 = require("../../infrastructure/database/dbModel/userModel");
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbModel/chatModel"));
exports.default = {
    userRegistration: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userInteractor_1.default.registerUser(req.body);
            res.status(200).json({ message: "registration success", user });
        }
        catch (error) {
            console.log(error);
            if (error.message === "User already exists") {
                res.status(409).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }),
    verifyOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("request received");
            const response = yield userInteractor_1.default.verifyUser(req.body);
            console.log("verifyOTP", response);
            res.status(200).json({ message: "Verify Success", response });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    resendOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const response = yield userInteractor_1.default.otpResend(email);
            res.status(200).json({ response });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    userLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        try {
            const { email, password } = req.body;
            const response = yield userInteractor_1.default.loginUser(email, password);
            const { token, refreshToken } = response;
            res.cookie("usertoken", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.status(200).json({ message: "Login success", response });
        }
        catch (error) {
            console.error("Controller error:", error.message);
            if (error.message === "User is not verified") {
                res.status(403).json({ message: "User is not verified" });
            }
            else {
                res.status(500).json({ message: error.message });
            }
        }
    }),
    googleAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userInteractor_1.default.googleUser(req.body);
            res.status(200).json({ message: "Google auth success", response });
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userInteractor_1.default.forgotPassword(req.body.email); // Pass the email from request body
            res.status(200).json(response); // Send success response
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message }); // Send error response
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token, password } = req.body; // Extract the token and new password from the request body
            // Call the interactor to reset the password
            const response = yield userInteractor_1.default.resetPassword(token, password);
            res.status(200).json(response); // Send success response
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message }); // Send error response
        }
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body, 'qwqwqwwqq');
        const { name, mobileNumber } = req.body;
        const { userId } = req.params;
        console.log(userId, req.params, "hellooo");
        console.log(name, mobileNumber, "haaii");
        try {
            const user = yield userModel_1.Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.name = name || user.name;
            user.mobileNumber = mobileNumber || user.mobileNumber;
            const updatedUser = yield user.save();
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Failed to update user" });
        }
    }),
    getProperties: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const properties = yield userInteractor_1.default.getPropertyList();
            return res
                .status(200)
                .json({ message: "Fetched propertied successfully", properties });
        }
        catch (error) {
            console.error("Error getting properties", error);
            res.status(500).json({ error: "Failed to get category" });
        }
    }),
    getPropertyDetailsById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { propertyId } = req.params;
            const property = yield userInteractor_1.default.fetchPropertyDetailsById(propertyId);
            if (!property)
                return res.status(404).json({ message: "Property not found" });
            res.status(200).json(property);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    addBookings: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { propertyId, userId, vendorId, visitDate, timeSlot } = req.body;
        try {
            const bookingDetails = yield userInteractor_1.default.bookings(propertyId, userId, vendorId, visitDate, timeSlot);
            res.status(201).json({
                message: "Booking successfully created!",
                booking: bookingDetails,
            });
        }
        catch (error) {
            console.error("Error creating booking:", error);
            // Ensure error is an instance of Error to safely access message
            if (error instanceof Error) {
                // If duplicate booking error
                if (error.message.includes("already exists")) {
                    return res.status(409).json({ message: error.message });
                }
                return res.status(500).json({
                    message: "Failed to create booking",
                    details: error.message,
                });
            }
            // Fallback in case error is not of type Error
            res
                .status(500)
                .json({ message: "Failed to create booking due to an unknown error" });
        }
    }),
    getVerifiedProperties: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const property = yield userInteractor_1.default.fetchProperties();
            if (!property)
                return res.status(404).json({ message: "Property not found" });
            res.status(200).json(property);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    getBookingDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.query;
        try {
            // Fetch bookings with populated references
            const bookings = yield userInteractor_1.default.fetchBookings(userId);
            res.status(200).json({ bookings });
        }
        catch (error) {
            console.error("Error fetching booking details:", error);
            res.status(500).json({ error: "Failed to fetch booking details" });
        }
    }),
    initiateChat: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, vendorId } = req.body; // Get user ID from protected route
        try {
            const chat = yield userInteractor_1.default.initiateChatSession(userId, vendorId);
            res.status(200).json({ chatId: chat._id });
        }
        catch (error) {
            console.error("Error initiating chat:", error);
            res.status(500).json({ message: "Failed to initiate chat" });
        }
    }),
    getChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        try {
            const chatHistory = yield userInteractor_1.default.getAllChats(chatId);
            res.status(200).json({ messages: chatHistory });
        }
        catch (error) {
            console.error("Error fetching chat history:", error);
            res.status(500).json({ message: "Failed to fetch chat history" });
        }
    }),
    sendMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        const { senderId, recipientId, senderModel, recipientModel, message } = req.body;
        try {
            const chat = yield chatModel_1.default.findById(chatId);
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }
            const newMessage = yield userInteractor_1.default.sendMessageToChat(chatId, senderId, message, recipientId, senderModel, recipientModel);
            res.status(200).json(newMessage);
        }
        catch (error) {
            console.error("Error in sendMessage controller:", error);
            res.status(500).json({ message: "Failed to send message" });
        }
    }),
    getChatList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const chatList = yield userInteractor_1.default.getChatLists(userId);
            res.status(200).json(chatList);
        }
        catch (error) {
            console.error("Error fetching chat list:", error);
            res.status(500).json({ message: "Failed to fetch chat list" });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token not provided" });
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
            const user = yield (0, mongoUserRepository_1.getUserbyEMail)(decoded.email);
            const { token: newAccessToken, refreshToken: newRefreshToken } = (0, jwtHelper_1.generateToken)(user === null || user === void 0 ? void 0 : user.id, decoded.email, "user");
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.json({ accessToken: newAccessToken });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                res
                    .status(200)
                    .json({ message: "User is authenticated", user: req.user });
            }
            else {
                res.status(401).json({ message: "User is not authenticated" });
            }
        }
        catch (error) {
            console.error("Unexpected error in resendOTP:", error);
            res.status(500).json({ error: "Failed to get user status" });
        }
    }),
    getAllBookings: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookings = yield userInteractor_1.default.getBookings();
            res.status(200).json(bookings);
        }
        catch (error) {
            console.error("Error in getAllBookings controller:", error);
            res.status(500).json({ error: "Failed to fetch booking data" });
        }
    }),
    getUserCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const usersCount = yield userInteractor_1.default.userCount();
            res.status(200).json(usersCount);
        }
        catch (error) {
            console.error("Error fetching user count:", error);
            res.status(500).json({ error: "Failed to fetch user count" });
        }
    }),
    getPropertyStats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Fetch property statistics from the interactor
            const propertyStats = yield userInteractor_1.default.getPropertyStats();
            // Send the response back to the client
            res.status(200).json(propertyStats);
        }
        catch (error) {
            console.error("Error fetching property stats:", error);
            res.status(500).json({ error: 'Failed to fetch property statistics' });
        }
    }),
};
