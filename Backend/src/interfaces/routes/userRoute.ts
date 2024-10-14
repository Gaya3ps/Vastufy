import { Router } from 'express';
import userController from '../controllers/userController';


const userRouter = Router();


userRouter.post('/signup',userController.userRegistration);
userRouter.post('/otp-verification', userController.verifyOTP);
userRouter.post('/resend-otp',userController.resendOTP)
userRouter.post('/login',userController.userLogin);
userRouter.post('/googleAuth',userController.googleAuth);
userRouter.post('/forgot-password',userController.forgotPassword);
userRouter.post('/reset-password',userController.resetPassword);
userRouter.put('/updateuser/:userId',userController.updateUser)

export default userRouter