// import express from "express";
// import session from "express-session";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./infrastructure/config/db";
// import { Server } from "socket.io";
// import cookieParser from "cookie-parser";
// import userRoutes from "./interfaces/routes/userRoute";
// import vendorRoutes from "./interfaces/routes/vendorRoute";
// import adminRoutes from "./interfaces/routes/adminRoute";
// import { createServer } from "http";
// import http from "http";
// import handleSocketEvents from "./domain/helper/socketHandler";

// const app = express();
// const server = http.createServer(app);

// dotenv.config();
// connectDB();

// const PORT = process.env.PORT || 5001;

// const corsOptions = {
//   // origin: "http://localhost:5173",
//   origin: "https://vastufy.vercel.app",
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// app.options("*", cors(corsOptions));

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(
//   session({
//     secret: "MY_SECRET",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );

// const io = new Server(server, {
//   cors: {
//     // origin: "http://localhost:5173",
//     origin: "https://vastufy.vercel.app",
//     methods: ["GET", "POST"],
//     credentials: true, // Allow credentials (e.g., cookies)
//   },
// });

// handleSocketEvents(io);

// app.use("/api/users", userRoutes);
// app.use("/api/vendor", vendorRoutes);
// app.use("/api/admin", adminRoutes);

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./infrastructure/config/db";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./interfaces/routes/userRoute";
import vendorRoutes from "./interfaces/routes/vendorRoute";
import adminRoutes from "./interfaces/routes/adminRoute";
import http from "http";
import handleSocketEvents from "./domain/helper/socketHandler";
import { CorsOptions } from 'cors';

// Load environment variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Database Connection
connectDB();

// Port configuration
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://vastufy.vercel.app";

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});

// CORS Configuration
const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    const allowedOrigins = [
      'http://localhost:5173', 
      'https://vastufy.vercel.app',
      process.env.FRONTEND_URL
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'), false);  // Deny the request
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware Setup
app.use(helmet()); // Add security headers
app.use(limiter); // Apply rate limiting
app.use(cors(corsOptions));
app.use(express.json({ 
  limit: '10kb' // Limit payload size
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10kb' 
}));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // Secure in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Socket.IO Configuration
const io = new Server(server, {
  cors: corsOptions,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
  }
});

// Socket Authentication Middleware
io.use((socket, next) => {
  try {
    // Add your socket authentication logic here
    // Example:
    const token = socket.handshake.auth.token;
    if (token) {
      // Validate token logic
      // If invalid, return next(new Error('Authentication error'))
      next();
    } else {
      next(new Error('No token provided'));
    }
  } catch (error) {
    console.error('Socket Authentication Error:', error);
    next(new Error('Authentication failed'));
  }
});

// Handle Socket Events
handleSocketEvents(io);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error Handler:', err);

  // Create the base error response
  const errorResponse = {
    status: 'error',
    message: err.message || 'An unexpected error occurred',
  };



  // Ensure that status code is defined on the error object
  const statusCode = err.status || 500;

  // Send the response
  res.status(statusCode).json(errorResponse);
});


// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal. Closing server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  // If server doesn't close in 10 seconds, forcefully shut down
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: Crash the process
  process.exit(1);
});

// Uncaught Exception Handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optional: Crash the process
  process.exit(1);
});

export default app;