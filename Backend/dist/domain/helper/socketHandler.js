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
const mongoose_1 = __importDefault(require("mongoose"));
const messageModel_1 = __importDefault(require("../../infrastructure/database/dbModel/messageModel"));
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbModel/chatModel"));
const handleSocketEvents = (io) => {
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Join room based on chat ID
        socket.on("join_room", (roomId) => __awaiter(void 0, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
                console.error(`Invalid chat ID: ${roomId}`);
                return;
            }
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        }));
        // Handle sending a text message
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log("Received message data:", data);
                if (!data.message || !data.message.trim()) {
                    console.error("Empty message content");
                    socket.emit("error", { message: "Message content is empty." });
                    return;
                }
                // Save message to the database
                const newMessage = new messageModel_1.default({
                    chatId: data.roomId,
                    senderId: data.senderId,
                    recipientId: data.recipientId,
                    senderModel: data.senderModel,
                    recipientModel: data.recipientModel,
                    message: data.message,
                });
                const savedMessage = yield newMessage.save();
                // Update the latest message in ChatModel and unread count
                yield chatModel_1.default.findByIdAndUpdate(data.roomId, {
                    latestMessage: savedMessage._id,
                    $inc: { [`unreadCount.${data.recipientId}`]: 1 },
                }, { new: true });
                // Emit message to all users in the room
                io.to(data.roomId).emit("receiveMessage", savedMessage);
                console.log("Message saved and sent:", savedMessage);
            }
            catch (error) {
                console.error("Error processing message:", error);
                socket.emit("error", { message: "Error processing message" });
            }
        }));
        // Mark a message as deleted
        socket.on("deleteMessage", (messageId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log("Received delete request for message ID:", messageId);
                const deletedMessage = yield messageModel_1.default.findByIdAndUpdate(messageId, { deleted: true }, { new: true });
                if (!deletedMessage) {
                    console.error("Message not found:", messageId);
                    socket.emit("error", { message: "Message not found" });
                    return;
                }
                const chatId = deletedMessage.chatId.toString();
                io.to(chatId).emit("messageDeleted", { messageId, deleted: true });
                console.log("Message marked as deleted and notification sent:", {
                    messageId,
                });
            }
            catch (error) {
                console.error("Error marking message as deleted:", error);
                socket.emit("error", { message: "Error deleting message" });
            }
        }));
        // Mark messages as read
        socket.on("messageRead", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, userId }) {
            try {
                yield messageModel_1.default.updateMany({ chatId: roomId, recipientId: userId, read: false }, { $set: { read: true } });
                yield chatModel_1.default.findByIdAndUpdate(roomId, {
                    $set: { [`unreadCount.${userId}`]: 0 },
                });
                const updatedMessages = yield messageModel_1.default.find({ chatId: roomId });
                io.to(roomId).emit("messagesUpdated", updatedMessages);
                console.log(`Marked messages as read in room ${roomId} for user ${userId}`);
            }
            catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }));
        // Typing indicator with role
        socket.on("typing", (data) => {
            console.log("Server received typing event:", data);
            io.to(data.roomId).emit("typing", data);
        });
        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.default = handleSocketEvents;
