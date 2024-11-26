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
exports.getPropertyStats = exports.getUsersCount = exports.getAllBookings = exports.getChats = exports.addMessageToChat = exports.fetchChats = exports.createOrFetchChatSession = exports.getBookingDetails = exports.getProperties = exports.getBookings = exports.getPropertyDetailsById = exports.listProperty = exports.updateUserPassword = exports.getUserByResetToken = exports.getUserbyEMail = exports.verifyUserDb = exports.googleUser = exports.getStoredOTP = exports.createUser = exports.saveOtp = exports.checkExistingUser = void 0;
const userModel_1 = require("../database/dbModel/userModel");
const otpModel_1 = __importDefault(require("../database/dbModel/otpModel"));
const hashPassword_1 = require("../../domain/helper/hashPassword");
const propertyModel_1 = require("../database/dbModel/propertyModel");
const bookingModel_1 = require("../database/dbModel/bookingModel");
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel_1 = __importDefault(require("../database/dbModel/chatModel"));
const messageModel_1 = __importDefault(require("../database/dbModel/messageModel"));
const checkExistingUser = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield userModel_1.Users.findOne({
        $and: [{ email: email }, { name: name }],
    });
    return existingUser;
});
exports.checkExistingUser = checkExistingUser;
const saveOtp = (email, otp, generatedAt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otpForStore = new otpModel_1.default({ otp, email, generatedAt });
        return yield otpForStore.save();
    }
    catch (error) {
        console.error("Error saving OTP:", error);
        throw new Error("Error saving OTP");
    }
});
exports.saveOtp = saveOtp;
const createUser = (userData, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("saved user", userData);
    if (!userData.email || !userData.name) {
        throw new Error("Email and name are required");
    }
    const email = userData.email;
    const name = userData.name;
    const existingUser = yield (0, exports.checkExistingUser)(email, name);
    if (existingUser) {
        if (existingUser.is_verified === false) {
            return existingUser;
        }
        throw new Error("User already exist");
    }
    if (!userData.name || !userData.email || !userData.password) {
        throw new Error("Name, email, and password are required fields");
    }
    const newUser = new userModel_1.Users({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
    });
    return yield newUser.save();
});
exports.createUser = createUser;
const getStoredOTP = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield otpModel_1.default.findOne({ email: email }).sort({ createdAt: -1 }).limit(1); });
exports.getStoredOTP = getStoredOTP;
const googleUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData.email || !userData.name) {
        throw new Error("Data undefined");
    }
    const existingUser = yield (0, exports.checkExistingUser)(userData.email, userData.name);
    if (existingUser) {
        return existingUser;
    }
    const generatepass = Math.random().toString(36).slice(-8);
    const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(generatepass);
    const newUser = new userModel_1.Users({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        is_google: true,
    });
    return yield newUser.save();
});
exports.googleUser = googleUser;
const verifyUserDb = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield userModel_1.Users.findOneAndUpdate({ email: email }, { $set: { is_verified: true } }, { new: true });
    return userData;
});
exports.verifyUserDb = verifyUserDb;
const getUserbyEMail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userModel_1.Users.findOne({ email: email });
});
exports.getUserbyEMail = getUserbyEMail;
// Function to find user by reset token
const getUserByResetToken = (resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by reset token
        const user = yield userModel_1.Users.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: new Date() }, // Ensure the token is not expired
        });
        return user;
    }
    catch (error) {
        console.error("Error fetching user by reset token:", error);
        throw new Error("Invalid or expired reset token");
    }
});
exports.getUserByResetToken = getUserByResetToken;
const updateUserPassword = (userId, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by ID and update the password field
        const user = yield userModel_1.Users.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true } // Return the updated user document
        );
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        console.error("Error updating password:", error);
        throw new Error("Error updating password");
    }
});
exports.updateUserPassword = updateUserPassword;
const listProperty = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield propertyModel_1.PropertyModel.find({ is_verified: true }) // Filter by verified properties
            .populate({
            path: "category", // Populate the 'category' field in each property
            model: "Category", // Reference to the Category model
        })
            .exec(); // Execute the query
        return properties;
    }
    catch (error) {
        throw new Error(`Error fetching properties: ${error.message}`);
    }
});
exports.listProperty = listProperty;
const getPropertyDetailsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield propertyModel_1.PropertyModel.findById(id)
        .populate("vendor")
        .populate("category");
});
exports.getPropertyDetailsById = getPropertyDetailsById;
const getBookings = (propertyId, userId, vendorId, visitDate, timeSlot) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if a booking already exists for this user, property, and visit date
        const existingBooking = yield bookingModel_1.BookingModel.findOne({
            propertyId: new mongoose_1.default.Types.ObjectId(propertyId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
            visitDate,
            timeSlot,
        });
        if (existingBooking) {
            // Throw a custom error with 409 status for duplicate bookings
            const error = new Error("You have already booked a visit for this date and time.");
            error.statusCode = 409;
            throw error;
        }
        // If no existing booking, create a new one
        const newBooking = new bookingModel_1.BookingModel({
            propertyId: new mongoose_1.default.Types.ObjectId(propertyId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
            vendorId: new mongoose_1.default.Types.ObjectId(vendorId),
            visitDate,
            timeSlot,
            createdAt: new Date(),
            status: "pending", // Ensure to include status field if applicable
        });
        // Save the booking to the database
        return yield newBooking.save();
    }
    catch (error) {
        if (error instanceof Error && error.statusCode === 409) {
            throw error;
        }
        throw new Error(error.message || "Failed to save booking");
    }
});
exports.getBookings = getBookings;
const getProperties = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield propertyModel_1.PropertyModel.find({ is_verified: true });
});
exports.getProperties = getProperties;
const getBookingDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bookingModel_1.BookingModel.find({ userId })
        .populate("propertyId", "title") // Populate property name
        .populate("userId", "name email") // Populate user details
        .populate("vendorId", "name") // Populate vendor name
        .select("propertyId userId vendorId visitDate timeSlot createdAt status"); // Specify fields
});
exports.getBookingDetails = getBookingDetails;
const createOrFetchChatSession = (users) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if a chat already exists between these users
        let chat = yield chatModel_1.default.findOne({ users: { $all: users } });
        if (!chat) {
            // If no existing chat, create a new one
            chat = yield chatModel_1.default.create({
                users,
                latestMessage: null,
                unreadCount: { [users[0]]: 0, [users[1]]: 0 },
            });
        }
        return chat;
    }
    catch (error) {
        console.error("Error fetching or creating chat session:", error);
        throw new Error("Failed to initiate chat session");
    }
});
exports.createOrFetchChatSession = createOrFetchChatSession;
const fetchChats = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messageModel_1.default.find({ chatId }).sort({ timestamp: 1 }); // Sort messages by timestamp
        if (!messages)
            throw new Error("Chat not found");
        return messages;
    }
    catch (error) {
        console.error("Error fetching chat from database:", error);
        throw error;
    }
});
exports.fetchChats = fetchChats;
const addMessageToChat = (chatId, senderId, message, recipientId, senderModel, recipientModel) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Repository: Adding message to chatId:", chatId);
    try {
        // Create a new message document in MessageModel
        const newMessage = yield messageModel_1.default.create({
            chatId,
            senderId,
            recipientId,
            senderModel,
            recipientModel,
            message,
            timestamp: new Date(),
        });
        // Update the latest message reference in ChatModel
        const updatedChat = yield chatModel_1.default.findByIdAndUpdate(chatId, {
            latestMessage: newMessage._id,
        }, { new: true } // Return the updated chat document
        );
        if (!updatedChat) {
            throw new Error("Chat not found");
        }
        console.log("Repository: Message added successfully:", newMessage);
        return newMessage; // Return the new message as a response
    }
    catch (error) {
        console.error("Error adding message to chat:", error);
        throw new Error("Failed to add message to chat");
    }
});
exports.addMessageToChat = addMessageToChat;
const getChats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Repository: Fetching chats for user ID:", userId);
    try {
        const chats = yield chatModel_1.default.find({
            users: userId, // Filter for chats where the user is a participant
        })
            .populate([
            { path: "users", model: "User", select: "name avatar" },
            { path: "users", model: "Vendor", select: "name" },
        ])
            .populate("latestMessage")
            .exec();
        console.log("Repository: Fetched chats:", chats);
        return chats;
    }
    catch (error) {
        console.error("Error fetching chats from database:", error);
        throw new Error("Failed to fetch chats");
    }
});
exports.getChats = getChats;
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve bookings, selecting the fields needed for the chart
        const bookings = yield bookingModel_1.BookingModel.find().select("visitDate");
        return bookings;
    }
    catch (error) {
        console.error("Error fetching bookings from the database:", error);
        throw error;
    }
});
exports.getAllBookings = getAllBookings;
const getUsersCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield userModel_1.Users.countDocuments();
        return count;
    }
    catch (error) {
        console.error("Error in getUsersCount:", error);
        throw error;
    }
});
exports.getUsersCount = getUsersCount;
const getPropertyStats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Aggregate property stats by month and year
        const propertyStats = yield propertyModel_1.PropertyModel.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" }, // Extract month from createdAt
                    year: { $year: "$createdAt" }, // Extract year from createdAt
                }
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year" }, // Group by year and month
                    propertyCount: { $sum: 1 }, // Count the number of properties in that month
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]);
        // Format the response for easier frontend consumption
        const formattedData = propertyStats.map(item => ({
            month: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'long' }), // Format month to name
            propertyCount: item.propertyCount,
        }));
        return formattedData;
    }
    catch (error) {
        console.error("Error fetching property statistics from MongoDB:", error);
        throw error;
    }
});
exports.getPropertyStats = getPropertyStats;
