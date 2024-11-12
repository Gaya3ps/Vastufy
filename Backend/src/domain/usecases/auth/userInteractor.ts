import { IUser } from "../../entities/types/userType";
import { generateOTP } from "../../../utils/otpUtils";
import {
  createUser,
  saveOtp,
  checkExistingUser,
  verifyUserDb,
  getUserbyEMail,
  googleUser,
  getUserByResetToken,
  updateUserPassword,
  listProperty,
  getPropertyDetailsById,
  getBookings,
  getProperties,
  getBookingDetails,
  createOrFetchChatSession,
  fetchChats,
  addMessageToChat,
  getChats,
} from "../../../infrastructure/repositories/mongoUserRepository";
import { Encrypt } from "../../helper/hashPassword";
import {
  sendOTPEmail,
  sendPasswordResetEmail,
} from "../../../utils/emailUtils";
import { getStoredOTP } from "../../../infrastructure/repositories/mongoUserRepository";
import { generateToken, generateResetToken, validateResetToken } from "../../helper/jwtHelper";
import { log } from "console";
import { stringify } from "querystring";

function createError(message: string, status: number) {
  const error: any = new Error(message);
  error.status = status;
  return error;
}

export default {
  registerUser: async (userData: IUser) => {
    console.log("userdata usecase", userData);

    try {
      if (!userData.email || !userData.name) {
        throw new Error("user data undefined");
      }

      const existingUser = await checkExistingUser(
        userData.email,
        userData.name
      );
      if (existingUser && existingUser.is_verified == true) {
        throw new Error("User already exists");
      }
      const otp = await generateOTP();
      console.log("otpppppppp", otp);

      const generatedAt = Date.now();
      await sendOTPEmail(userData.email, otp, userData.name);
      const savedOtp = await saveOtp(userData.email, otp, generatedAt);

      const password = userData.password as string;
      const hashedPassword = await Encrypt.cryptPassword(password);
      const savedUser = await createUser(userData, hashedPassword);

      console.log(savedUser);
      return savedUser;
    } catch (error: any) {
      throw error;
    }
  },

  verifyUser: async (data: { otp: string; email: string }) => {
    console.log("body ", data);

    if (!data.otp) {
      throw new Error("no otp");
    }
    const storedOTP = await getStoredOTP(data.email);
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

    return await verifyUserDb(data.email);
  },

  otpResend: async (email: string) => {
    try {
      const newotp = await generateOTP();
      const generatedAt = Date.now();
      const users = await getUserbyEMail(email);
      if (users && users.name) {
        await sendOTPEmail(email, newotp, users.name);
        console.log("newOtp:", newotp);

        await saveOtp(email, newotp, generatedAt);
      } else {
        throw new Error("Please signup again");
      }
    } catch (error) {
      throw new Error("Failed to resend otp");
    }
  },
  loginUser: async (email: string, password: string) => {
    const existingUser = await getUserbyEMail(email);
    if (!existingUser || !existingUser.password) {
      throw new Error("User not found");
    }
    const isValid = await Encrypt.comparePassword(
      password,
      existingUser.password
    );
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

    const { token, refreshToken } = await generateToken(
      existingUser.id,
      email,
      role
    );
    const user = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      isBlocked: existingUser.is_blocked,
    };
    return { token, user, refreshToken };
  },

  googleUser: async (userData: IUser) => {
    try {
      const savedUser = await googleUser(userData);
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
          await savedUser.save(); // Save the user if any changes were made
        }

        if (!savedUser._id || !savedUser.email) {
          throw new Error("User ID or email is undefined");
        }
        if (savedUser.is_blocked) {
          throw createError("Account is Blocked", 403); // Forbidden
        }
        const role = "user";
        let { token, refreshToken } = generateToken(
          savedUser.id,
          savedUser.email,
          role
        );
        log(token, refreshToken, "refresh");
        return { user, token, refreshToken };
      }
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    const user = await getUserbyEMail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate reset token (e.g., JWT or random token)
    const resetToken = generateResetToken(email); // Ensure the User model has a method to generate this token
    console.log(resetToken, "this is rest token");

    // Save reset token and expiration time to the user in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(
      user.email || "",
      resetToken,
      user.name || "User"
    );
    return { message: "Password reset email sent" };
  },

  resetPassword: async (token: string, newPassword: string) => {
    // Find user by reset token
    const user = await getUserByResetToken(token);
    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Check if the reset token is still valid
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error("Reset token has expired");
    }

    // Validate token (optional, if you're using JWT or other signed tokens)
    const isTokenValid = validateResetToken(token, user.email);
    if (!isTokenValid) {
      throw new Error("Invalid reset token");
    }

     // Hash the new password using your existing Encrypt.cryptPassword method
  const hashedPassword = await Encrypt.cryptPassword(newPassword);
    // Update the user's password in the database
    await updateUserPassword(user.id, hashedPassword);

    // Clear reset token and expiration
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return { message: "Password has been reset successfully" };
  },



  getPropertyList: async () => {
    try {
      const propertyList = await listProperty();
      return propertyList;
    } catch (error: any) {
      console.error("Error in addVendorProperty:", error);
      throw new Error("Error adding property: " + error.message);
    }
  },


  fetchPropertyDetailsById: async (propertyId: string) => {
   try {
    const property = await getPropertyDetailsById(propertyId)
    return property;
   } catch (error) {
    throw new Error ("Failed to get property")
   } 
  },


  bookings: async (propertyId: string, userId: string, vendorId: string, visitDate: Date, timeSlot: string) => {
    try {
      const newBooking = await getBookings(propertyId, userId, vendorId, visitDate, timeSlot);
      return newBooking;
    } catch (error) {
      throw new Error("Failed to save booking");
    }
  },


  fetchProperties: async()=>{
    try {
      const property = await getProperties();
      return property;
    } catch (error) {
      console.error("Error fetching vendor by id:", error);
      throw new Error("Failed to fetch vendor");
    }
  },


  fetchBookings: async (userId: string) => {
    try {
      const bookings = await getBookingDetails(userId);
      return bookings;
    } catch (error) {
      console.error('Error in fetchBookings:', error);
      throw error;
    }
  },

  initiateChatSession:async (userId: string, vendorId: string) => {
    try {
      return await createOrFetchChatSession([userId, vendorId]);
    } catch (error) {
      console.error('Failed to initiate chat session:', error);
      throw new Error('Failed to initiate chat session');
    }
  },

  getAllChats: async (chatId: string) => {
    try {
      return await fetchChats(chatId);
    } catch (error) {
      console.error('Error in fetching chat history:', error);
      throw new Error('Failed to fetch chat history');
    }
  },


  sendMessageToChat: async (
    chatId: string,
    senderId: string,
    message: string,
    recipientId: string,
    senderModel: 'User' | 'Vendor',  // Add senderModel as a parameter
    recipientModel: 'User' | 'Vendor' // Add recipientModel as a parameter
  ) => {
    try {
      // Pass all parameters to addMessageToChat
      return await addMessageToChat(chatId, senderId, message, recipientId, senderModel, recipientModel);
    } catch (error) {
      console.error("Error in sendMessage interactor:", error);
      throw new Error("Failed to send message");
    }
  },


  getChatLists: async (userId: string) => {
    console.log("Interactor: Getting chat list for user ID:", userId);
  
    try {
      return await getChats(userId);
    } catch (error) {
      console.error('Error in fetching chat list from interactor:', error);
      throw new Error('Failed to fetch chat list');
    }
  }
  



};
