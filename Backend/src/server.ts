import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./infrastructure/config/db";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import userRoutes from "./interfaces/routes/userRoute";
import vendorRoutes from "./interfaces/routes/vendorRoute";
import adminRoutes from "./interfaces/routes/adminRoute";
import { createServer } from "http";
import http from "http";
import handleSocketEvents from './domain/helper/socketHandler';

const app = express();
const server = http.createServer(app);

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5001;


const corsOptions = {
  // origin: "http://localhost:5173",
  origin:"https://vastufy.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "MY_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);


const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin:"https://vastufy.vercel.app",
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (e.g., cookies)
  },
});


handleSocketEvents(io)


app.use("/api/users", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
