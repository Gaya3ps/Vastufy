import { Router } from 'express';
import userController from '../controllers/userController';
import { protectUser } from '../frameworks/webserver/middleware/userAuthMiddleware';


const userRouter = Router();


userRouter.post('/signup',userController.userRegistration);
userRouter.post('/otp-verification', userController.verifyOTP);
userRouter.post('/resend-otp',userController.resendOTP)
userRouter.get('/getStatus',protectUser,userController.getStatus);
userRouter.post('/login',userController.userLogin);
userRouter.post('/googleAuth',userController.googleAuth);
userRouter.post('/forgot-password',userController.forgotPassword);
userRouter.post('/reset-password',userController.resetPassword);
userRouter.put('/updateuser/:userId',protectUser,userController.updateUser);
userRouter.get('/properties',userController.getProperties);
userRouter.get('/propertydetails/:propertyId',protectUser ,userController.getPropertyDetailsById);
userRouter.post('/bookings',protectUser, userController.addBookings);
userRouter.get('/properties',userController.getVerifiedProperties);
userRouter.get('/bookingdetails',userController.getBookingDetails);
userRouter.post('/chat/initiate',protectUser,userController.initiateChat);
userRouter.get('/chat/:chatId',userController.getChats);
userRouter.post('/chat/:chatId/send',protectUser,userController.sendMessage);
userRouter.get('/chatList/:userId',protectUser,userController.getChatList);
userRouter.post('/refreshtoken',userController.refreshToken);



export default userRouter