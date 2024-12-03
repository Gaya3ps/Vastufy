"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./infrastructure/config/db"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const userRoute_1 = __importDefault(require("./interfaces/routes/userRoute"));
const vendorRoute_1 = __importDefault(require("./interfaces/routes/vendorRoute"));
const adminRoute_1 = __importDefault(require("./interfaces/routes/adminRoute"));
const http_1 = __importDefault(require("http"));
const socketHandler_1 = __importDefault(require("./domain/helper/socketHandler"));
// Load environment variables
dotenv_1.default.config();
// Create Express app and HTTP server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Database Connection
(0, db_1.default)();
// Port configuration
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://vastufy.vercel.app";
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
});
// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        const allowedOrigins = [
            'http://localhost:5173',
            'https://vastufy.vercel.app',
            process.env.FRONTEND_URL
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the request
        }
        else {
            callback(new Error('Not allowed by CORS'), false); // Deny the request
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
// Middleware Setup
app.use((0, helmet_1.default)()); // Add security headers
app.use(limiter); // Apply rate limiting
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({
    limit: '10kb' // Limit payload size
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '10kb'
}));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
// Session Configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Secure in production
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Socket.IO Configuration
const io = new socket_io_1.Server(server, {
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
        }
        else {
            next(new Error('No token provided'));
        }
    }
    catch (error) {
        console.error('Socket Authentication Error:', error);
        next(new Error('Authentication failed'));
    }
});
// Handle Socket Events
(0, socketHandler_1.default)(io);
// Routes
app.use("/api/users", userRoute_1.default);
app.use("/api/vendor", vendorRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
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
exports.default = app;
