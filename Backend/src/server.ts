import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './infrastructure/config/db';
import cookieParser from 'cookie-parser';
import userRoutes from './interfaces/routes/userRoute'
import vendorRoutes from './interfaces/routes/vendorRoute'
import adminRoutes from './interfaces/routes/adminRoute'
import { createServer } from 'http';
import http from 'http'
const app = express();
const server = http.createServer(app);


dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  
  app.use(session({
    secret: 'MY_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
  
  app.use('/api/users', userRoutes);
  app.use('/api/vendor', vendorRoutes);
  app.use('/api/admin', adminRoutes);




server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  