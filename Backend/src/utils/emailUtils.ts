import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a reusable transporter function
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASS}`,
    },
  });
};

// Function to send OTP Email
export const sendOTPEmail = async (email: string, otp: string, name: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions: nodemailer.SendMailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: `${email}`,
      subject: "Email Verification Required",
      html: `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
          }
          .content {
            margin-top: 20px;
            font-size: 16px;
            color: #555555;
          }
          .otp-code {
            margin: 20px 0;
            padding: 10px 20px;
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4CAF50;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Verify Your Email Address</div>
          <div class="content">
            <p>${name}</p>
            <p>Thank you for registering with us. To complete your registration, please use the OTP below:</p>
            <div class="otp-code">${otp}</div>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </div>
      </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error("Error sending OTP email:", error);
      } else {
        console.log("OTP email sent:", info.response);
      }
    });
  } catch (error) {
    console.error('Error in sendOTPEmail:', error);
  }
};

// Function to send Password Reset Email
export const sendPasswordResetEmail = async (email: string, resetToken: string, name: string) => {
  try {
    const transporter = createTransporter();
    const resetLink = `https://vastufy.vercel.app/reset-password?token=${resetToken}`;


    const mailOptions: nodemailer.SendMailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: `${email}`,
      subject: 'Password Reset Request',
      html: `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
          }
          .content {
            margin-top: 20px;
            font-size: 16px;
            color: #555555;
          }
          .reset-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
          }
          .reset-button:hover {
            background-color: #0056b3;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Password Reset Request</div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to reset your password:</p>
            <a href="${resetLink}" class="reset-button">Reset Password</a>
            <p>If you did not request this, please ignore this email, and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </div>
      </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error('Error sending password reset email:', error);
      } else {
        console.log('Password reset email sent:', info.response);
      }
    });
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
  }
};
