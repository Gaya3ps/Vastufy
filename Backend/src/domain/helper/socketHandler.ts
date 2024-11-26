import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import MessageModel from "../../infrastructure/database/dbModel/messageModel";
import ChatModel from "../../infrastructure/database/dbModel/chatModel";

const handleSocketEvents = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room based on chat ID
    socket.on("join_room", async (roomId) => {
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        console.error(`Invalid chat ID: ${roomId}`);
        return;
      }
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle sending a text message
    socket.on("sendMessage", async (data) => {
      try {
        console.log("Received message data:", data);

        if (!data.message || !data.message.trim()) {
          console.error("Empty message content");
          socket.emit("error", { message: "Message content is empty." });
          return;
        }

        // Save message to the database
        const newMessage = new MessageModel({
          chatId: data.roomId,
          senderId: data.senderId,
          recipientId: data.recipientId,
          senderModel: data.senderModel,
          recipientModel: data.recipientModel,
          message: data.message,
        });
        const savedMessage = await newMessage.save();

        // Update the latest message in ChatModel and unread count
        await ChatModel.findByIdAndUpdate(
          data.roomId,
          {
            latestMessage: savedMessage._id,
            $inc: { [`unreadCount.${data.recipientId}`]: 1 },
          },
          { new: true }
        );

        // Emit message to all users in the room
        io.to(data.roomId).emit("receiveMessage", savedMessage);
        console.log("Message saved and sent:", savedMessage);
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("error", { message: "Error processing message" });
      }
    });

    // Mark a message as deleted
    socket.on("deleteMessage", async (messageId) => {
      try {
        console.log("Received delete request for message ID:", messageId);
        const deletedMessage = await MessageModel.findByIdAndUpdate(
          messageId,
          { deleted: true },
          { new: true }
        );

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
      } catch (error) {
        console.error("Error marking message as deleted:", error);
        socket.emit("error", { message: "Error deleting message" });
      }
    });

    // Mark messages as read
    socket.on("messageRead", async ({ roomId, userId }) => {
      try {
        await MessageModel.updateMany(
          { chatId: roomId, recipientId: userId, read: false },
          { $set: { read: true } }
        );

        await ChatModel.findByIdAndUpdate(roomId, {
          $set: { [`unreadCount.${userId}`]: 0 },
        });

        const updatedMessages = await MessageModel.find({ chatId: roomId });
        io.to(roomId).emit("messagesUpdated", updatedMessages);

        console.log(
          `Marked messages as read in room ${roomId} for user ${userId}`
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

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

export default handleSocketEvents;
