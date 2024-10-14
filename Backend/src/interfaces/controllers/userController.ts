import {Request,Response,NextFunction} from "express";
import userInteractor from "../../domain/usecases/auth/userInteractor";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import { getUserbyEMail } from "../../infrastructure/repositories/mongoUserRepository";

import { generateToken } from "../../domain/helper/jwtHelper";
import { Users } from "../../infrastructure/database/dbModel/userModel";


export default {
    userRegistration: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userInteractor.registerUser(req.body);
        res.status(200).json({ message: "registration success", user });
  
      } catch (error: any) {
        console.log(error);
        if (error.message === 'User already exists') {
          res.status(409).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal server error' });
        }
      }
    },


verifyOTP: async (req: Request, res: Response) => {
  try {
    console.log("request received")
    const response = await userInteractor.verifyUser(req.body);
    console.log("verifyOTP", response);
    res.status(200).json({ message: 'Verify Success', response })
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ error: error.message })

  }
},

resendOTP: async (req: Request, res: Response) => {
  try {

    const { email } = req.body

    const response = await userInteractor.otpResend(email)
    res.status(200).json({ response })
  } catch (error) {
    res.status(500).json(error)
  }
},

userLogin: async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const response = await userInteractor.loginUser(email, password);
    const { token, refreshToken } = response;
    res.cookie('usertoken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json({ message: 'Login success', response });
  } catch (error: any) {
    console.error("Controller error:", error.message);
    if (error.message === 'User is not verified') {
      res.status(403).json({ message: 'User is not verified' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
},

googleAuth: async (req: Request, res: Response) => {
  try {
    const response = await userInteractor.googleUser(req.body);
    res.status(200).json({ message: 'Google auth success', response })
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error)
  }
},

forgotPassword:async (req: Request, res: Response) => {
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
    console.log(token,"yyyyyyy");
    
    // Call the interactor to reset the password
    const response = await userInteractor.resetPassword(token, password);
    
    res.status(200).json(response); // Send success response
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Send error response
  }
},

updateUser:async(req:Request , res:Response) => {
  const {name} = req.body
    const {userId} = req.params
  try {
    
    const user = await Users.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = name || user.name;


    const updatedUser =  await user.save();
    console.log(updatedUser,'upuser')
    res.status(200).json(  updatedUser );
    
  } catch (error) {
    console.error('Error updating user:', error);
res.status(500).json({ message: 'Failed to update user' });
  }
}



// refreshToken: async (req: Request, res: Response) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;


//     if (!refreshToken) {
//       return res.status(401).json({ message: "Refresh token not provided" });
//     }

//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as { user: string, email: string, role: string };
//     const user = await getUserbyEMail(decoded.email)
//     const { token: newAccessToken, refreshToken: newRefreshToken } = generateToken(user?.id, decoded.email, 'user');
//     res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
//     res.json({ accessToken: newAccessToken });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// },
  



}