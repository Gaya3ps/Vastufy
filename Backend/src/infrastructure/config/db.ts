import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;



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
