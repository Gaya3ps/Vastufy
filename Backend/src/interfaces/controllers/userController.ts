import { Request, Response, NextFunction } from "express";
import userInteractor from "../../domain/usecases/auth/userInteractor";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {
  getUserbyEMail,
  getUsersCount,
  PropertyQueryParams,
} from "../../infrastructure/repositories/mongoUserRepository";

import { generateToken } from "../../domain/helper/jwtHelper";
import { Users } from "../../infrastructure/database/dbModel/userModel";
import ChatModel from "../../infrastructure/database/dbModel/chatModel";

export default {
  userRegistration: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userInteractor.registerUser(req.body);

      res.status(200).json({ message: "registration success", user });
    } catch (error: any) {
      console.log(error);
      if (error.message === "User already exists") {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  },

  verifyOTP: async (req: Request, res: Response) => {
    try {
      console.log("request received");
      const response = await userInteractor.verifyUser(req.body);
      console.log("verifyOTP", response);
      res.status(200).json({ message: "Verify Success", response });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },

  resendOTP: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const response = await userInteractor.otpResend(email);
      res.status(200).json({ response });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  userLogin: async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      const { email, password } = req.body;
      const response = await userInteractor.loginUser(email, password);
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
    } catch (error: any) {
      console.error("Controller error:", error.message);
      if (error.message === "User is not verified") {
        res.status(403).json({ message: "User is not verified" });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  },

  googleAuth: async (req: Request, res: Response) => {
    try {
      const response = await userInteractor.googleUser(req.body);
      res.status(200).json({ message: "Google auth success", response });
    } catch (error: any) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      const response = await userInteractor.forgotPassword(req.body.email); // Pass the email from request body
      res.status(200).json(response); // Send success response
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message }); // Send error response
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body; // Extract the token and new password from the request body

      // Call the interactor to reset the password
      const response = await userInteractor.resetPassword(token, password);

      res.status(200).json(response); // Send success response
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message }); // Send error response
    }
  },

  updateUser: async (req: Request, res: Response) => {
    console.log(req.body,'qwqwqwwqq');
    
    const { name, mobileNumber} = req.body;
    const { userId } = req.params;
    console.log(userId,req.params,"hellooo");
    console.log(name, mobileNumber,"haaii")
    
    try {
      const user = await Users.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name || user.name;
      user.mobileNumber = mobileNumber || user.mobileNumber;
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  },

  getProperties: async (req: Request, res: Response) => {
    try {
      const properties = await userInteractor.getPropertyList();
      return res
        .status(200)
        .json({ message: "Fetched propertied successfully", properties });
    } catch (error) {
      console.error("Error getting properties", error);
      res.status(500).json({ error: "Failed to get category" });
    }
  },

  getPropertyDetailsById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { propertyId } = req.params;

      const property = await userInteractor.fetchPropertyDetailsById(
        propertyId
      );
      if (!property)
        return res.status(404).json({ message: "Property not found" });
      res.status(200).json(property);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      next(error);
    }
  },

  addBookings: async (req: Request, res: Response) => {
    const { propertyId, userId, vendorId, visitDate, timeSlot } = req.body;
    try {
      const bookingDetails = await userInteractor.bookings(
        propertyId,
        userId,
        vendorId,
        visitDate,
        timeSlot
      );
      res.status(201).json({
        message: "Booking successfully created!",
        booking: bookingDetails,
      });
    } catch (error: unknown) {
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
  },

  getVerifiedProperties: async (req: Request, res: Response) => {
    try {
      const property = await userInteractor.fetchProperties();
      if (!property)
        return res.status(404).json({ message: "Property not found" });
      res.status(200).json(property);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },

  getBookingDetails: async (req: Request, res: Response) => {
    const { userId } = req.query;
    try {
      // Fetch bookings with populated references
      const bookings = await userInteractor.fetchBookings(userId as string);
      res.status(200).json({ bookings });
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ error: "Failed to fetch booking details" });
    }
  },

  initiateChat: async (req: Request, res: Response) => {
    const { userId, vendorId } = req.body; // Get user ID from protected route
    try {
      const chat = await userInteractor.initiateChatSession(userId, vendorId);
      res.status(200).json({ chatId: chat._id });
    } catch (error) {
      console.error("Error initiating chat:", error);
      res.status(500).json({ message: "Failed to initiate chat" });
    }
  },

  getChats: async (req: Request, res: Response) => {
    const { chatId } = req.params;
    try {
      const chatHistory = await userInteractor.getAllChats(chatId);
      res.status(200).json({ messages: chatHistory });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  },

  sendMessage: async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { senderId, recipientId, senderModel, recipientModel, message } =
      req.body;

    try {
      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const newMessage = await userInteractor.sendMessageToChat(
        chatId,
        senderId,
        message,
        recipientId,
        senderModel,
        recipientModel
      );

      res.status(200).json(newMessage);
    } catch (error) {
      console.error("Error in sendMessage controller:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  },

  getChatList: async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const chatList = await userInteractor.getChatLists(userId);
      res.status(200).json(chatList);
    } catch (error) {
      console.error("Error fetching chat list:", error);
      res.status(500).json({ message: "Failed to fetch chat list" });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not provided" });
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY!
      ) as { user: string; email: string; role: string };
      const user = await getUserbyEMail(decoded.email);
      const { token: newAccessToken, refreshToken: newRefreshToken } =
        generateToken(user?.id, decoded.email, "user");
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getStatus: async (req: Request, res: Response) => {
    try {
      if (req.user) {
        res
          .status(200)
          .json({ message: "User is authenticated", user: req.user });
      } else {
        res.status(401).json({ message: "User is not authenticated" });
      }
    } catch (error) {
      console.error("Unexpected error in resendOTP:", error);
      res.status(500).json({ error: "Failed to get user status" });
    }
  },

  getAllBookings: async (req: Request, res: Response) => {
    try {
      const bookings = await userInteractor.getBookings();
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error in getAllBookings controller:", error);
      res.status(500).json({ error: "Failed to fetch booking data" });
    }
  },

  getUserCount: async (req: Request, res: Response) => {
    try {
      const usersCount = await userInteractor.userCount();
      res.status(200).json(usersCount);
    } catch (error) {
      console.error("Error fetching user count:", error);
      res.status(500).json({ error: "Failed to fetch user count" });
    }
  },

  getPropertyStats: async(req: Request, res: Response) =>{
    try {
      // Fetch property statistics from the interactor
      const propertyStats = await userInteractor.getPropertyStats();
      
      // Send the response back to the client
      res.status(200).json(propertyStats);
    } catch (error) {
      console.error("Error fetching property stats:", error);
      res.status(500).json({ error: 'Failed to fetch property statistics' });
    }
  },
  

};
