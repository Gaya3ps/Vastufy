import { IUser } from "../../domain/entities/types/userType";
import  { Iuser, Users } from "../database/dbModel/userModel";
import OTPModel from "../database/dbModel/otpModel";
import { Encrypt } from "../../domain/helper/hashPassword";
import { PropertyModel } from "../database/dbModel/propertyModel";
import { BookingModel } from "../database/dbModel/bookingModel";
import mongoose from "mongoose";
import ChatModel from "../database/dbModel/chatModel";
import MessageModel from "../database/dbModel/messageModel";

export const checkExistingUser = async(email:string, name:string) => {
    const existingUser = await Users.findOne({ $and: [{email:email},{name:name}]})
    return existingUser
}

export const saveOtp = async (email: string, otp: string, generatedAt: number) => {
    try {
      const otpForStore = new OTPModel({ otp, email, generatedAt });
     return await otpForStore.save();
      
      
    } catch (error) {
      console.error('Error saving OTP:', error);
      throw new Error('Error saving OTP');
    }

  };

  export const createUser = async (userData: IUser, hashedPassword:string): Promise<IUser> => {
    console.log("saved user",userData);
    if (!userData.email || !userData.name) {
        throw new Error("Email and name are required");
      }

    const email = userData.email as string
    const name = userData.name as string
    const existingUser = await checkExistingUser(email, name)
    if(existingUser){
        if(existingUser.is_verified === false){
            return existingUser
        }
        throw new Error('User already exist')
    }
    if (!userData.name || !userData.email || !userData.password) {
        throw new Error("Name, email, and password are required fields");
    }
    
    const newUser = new Users({
        name: userData.name,
        email: userData.email,
        password:hashedPassword
      });

    return await newUser.save();
}

export const getStoredOTP = async( email: string ) => await OTPModel.findOne({email:email}).sort({ createdAt: -1 }).limit(1);

export const googleUser = async (userData:IUser) => {

  if(!userData.email || !userData.name){
      throw new Error('Data undefined')
  }

  const existingUser = await checkExistingUser(userData.email,userData.name);
  if(existingUser){
      return existingUser;
  }

  const generatepass = Math.random().toString(36).slice(-8)
  const hashedPassword = await Encrypt.cryptPassword(generatepass);

  const newUser = new Users({
      name:userData.name,
      email:userData.email,
      password:hashedPassword,
      is_google:true
  })

  return await newUser.save();

}


export const verifyUserDb = async(email:string) => {
  const userData = await Users.findOneAndUpdate(
      { email: email },
      { $set: { is_verified:true} },
      { new: true }
  );
  return userData
}


export const getUserbyEMail = async (email:string)=> {
  return await Users.findOne({email:email})
}


// Function to find user by reset token
export const getUserByResetToken = async (resetToken: string) => {
  try {
    // Find the user by reset token
    const user = await Users.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: new Date() }, // Ensure the token is not expired
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by reset token:", error);
    throw new Error("Invalid or expired reset token");
  }
};


export const updateUserPassword = async (userId: string, hashedPassword: string) => {
  try {
    // Find user by ID and update the password field
    const user = await Users.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }  // Return the updated user document
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error('Error updating password:', error);
    throw new Error('Error updating password');
  }
};


export const listProperty = async () => {
  try {
    const properties = await PropertyModel.find({ is_verified: true }) // Filter by verified properties
      .populate({
        path: "category", // Populate the 'category' field in each property
        model: "Category", // Reference to the Category model
      })
      .exec(); // Execute the query

    console.log(properties, "Verified properties");
    return properties;
  } catch (error: any) {
    throw new Error(`Error fetching properties: ${error.message}`);
  }
};

 export const getPropertyDetailsById = async(id: string) => {
  return await PropertyModel.findById(id).populate('vendor').populate('category');
 }

 export const getBookings = async (propertyId: string, userId: string, vendorId: string, visitDate: Date, timeSlot: string) => {
  try {
    // Check if a booking already exists for this user, property, and visit date
    const existingBooking = await BookingModel.findOne({
      propertyId: new mongoose.Types.ObjectId(propertyId),
      userId: new mongoose.Types.ObjectId(userId),
      visitDate,
      timeSlot
    });

    if (existingBooking) {
      // Throw a custom error with 409 status for duplicate bookings
      const error = new Error("You have already booked a visit for this date and time.") as Error & { statusCode: number };
      error.statusCode = 409;
      throw error;
    }

    // If no existing booking, create a new one
    const newBooking = new BookingModel({
      propertyId: new mongoose.Types.ObjectId(propertyId),
      userId: new mongoose.Types.ObjectId(userId),
      vendorId: new mongoose.Types.ObjectId(vendorId),
      visitDate,
      timeSlot,
      createdAt: new Date(),
      status: 'pending', // Ensure to include status field if applicable
    });

    // Save the booking to the database
    return await newBooking.save();
  }  catch (error) {
    if (error instanceof Error && (error as any).statusCode === 409) {
      throw error; 
    }
    throw new Error((error as Error).message || "Failed to save booking");
  }
};



export const getProperties = async() =>{
    return await PropertyModel.find({is_verified: true});
  };

  
  export const getBookingDetails = async (userId: string) => {
    return await BookingModel.find({ userId })
      .populate('propertyId', 'title') // Populate property name
      .populate('userId', 'name email') // Populate user details
      .populate('vendorId', 'name') // Populate vendor name
      .select('propertyId userId vendorId visitDate timeSlot createdAt status'); // Specify fields
  };


  export const createOrFetchChatSession = async (users: string[]) => {
    try {
      // Check if a chat already exists between these users
      let chat = await ChatModel.findOne({ users: { $all: users } });
  
      if (!chat) {
        // If no existing chat, create a new one
        chat = await ChatModel.create({
          users,
          latestMessage: null,
          unreadCount: { [users[0]]: 0, [users[1]]: 0 },
        });
      }
  
      return chat;
    } catch (error) {
      console.error('Error fetching or creating chat session:', error);
      throw new Error('Failed to initiate chat session');
    }
  };

  export const fetchChats = async (chatId: string) => {
    try {
      const messages = await MessageModel.find({ chatId }).sort({ timestamp: 1 }); // Sort messages by timestamp
      if (!messages) throw new Error('Chat not found');
      return messages;
    } catch (error) {
      console.error('Error fetching chat from database:', error);
      throw error;
    }
  };

  export const addMessageToChat = async (
    chatId: string,
    senderId: string,
    message: string,
    recipientId: string,
    senderModel: 'User' | 'Vendor',
    recipientModel: 'User' | 'Vendor'
  ) => {
    console.log("Repository: Adding message to chatId:", chatId);
  
    try {
      // Create a new message document in MessageModel
      const newMessage = await MessageModel.create({
        chatId,
        senderId,
        recipientId,
        senderModel,
        recipientModel,
        message,
        timestamp: new Date(),
      });
  
      // Update the latest message reference in ChatModel
      const updatedChat = await ChatModel.findByIdAndUpdate(
        chatId,
        {
          latestMessage: newMessage._id,
        },
        { new: true } // Return the updated chat document
      );
  
      if (!updatedChat) {
        throw new Error("Chat not found");
      }
  
      console.log("Repository: Message added successfully:", newMessage);
      return newMessage; // Return the new message as a response
    } catch (error) {
      console.error("Error adding message to chat:", error);
      throw new Error("Failed to add message to chat");
    }
  };
  export const getChats = async (userId: string) => {
    console.log("Repository: Fetching chats for user ID:", userId);
  
    try {
      const chats = await ChatModel.find({
        users: userId // Filter for chats where the user is a participant
      })
      .populate([
        { path: 'users', model: 'User', select: 'name avatar' },
        { path: 'users', model: 'Vendor', select: 'name' }
      ])
      
      .populate('latestMessage')
      .exec();
  
      console.log("Repository: Fetched chats:", chats);
      return chats;
    } catch (error) {
      console.error('Error fetching chats from database:', error);
      throw new Error('Failed to fetch chats');
    }
  };
  