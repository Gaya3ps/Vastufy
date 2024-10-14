import { IUser } from "../../domain/entities/types/userType";
import  { Iuser, Users } from "../database/dbModel/userModel";
import OTPModel from "../database/dbModel/otpModel";
import { Encrypt } from "../../domain/helper/hashPassword";

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




