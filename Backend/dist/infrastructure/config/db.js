"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
});
exports.default = connectDB;
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// // Load environment variables from .env file
// dotenv.config();
// const connectDB = async (): Promise<void> => {
//   // Get the MongoDB URI from environment variables
//   const mongoUri = process.env.MONGO_URI;
//   // Check if the URI is defined
//   if (!mongoUri) {
//     console.error('MongoDB URI is not defined in the environment variables');
//     process.exit(1); // Exit the process if the URI is not available
//   }
//   try {
//     // Attempt to connect to MongoDB
//     const conn = await mongoose.connect(mongoUri);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     // Log any errors and exit the process
//     console.error(`Error: ${(error as Error).message}`);
//     process.exit(1);
//   }
// };
// export default connectDB;
