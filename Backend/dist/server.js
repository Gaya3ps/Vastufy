"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./infrastructure/config/db"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoute_1 = __importDefault(require("./interfaces/routes/userRoute"));
const vendorRoute_1 = __importDefault(require("./interfaces/routes/vendorRoute"));
const adminRoute_1 = __importDefault(require("./interfaces/routes/adminRoute"));
const http_1 = __importDefault(require("http"));
const socketHandler_1 = __importDefault(require("./domain/helper/socketHandler"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config();
(0, db_1.default)();
const PORT = process.env.PORT || 5001;
// const corsOptions = {
//   // origin: "http://localhost:5173",
//   origin:"https://vastufy.vercel.app",
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
// const corsOptions = {
//   origin: ["https://vastufy.vercel.app"], // Allow the specific frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
// app.options("*", cors(corsOptions))
// app.use(cors(corsOptions));
const corsOptions = {
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // Set to false because with "*" you cannot allow credentials
};
app.options("*", (0, cors_1.default)(corsOptions));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "MY_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
const io = new socket_io_1.Server(server, {
    cors: {
        // origin: "http://localhost:5173",
        origin: "https://vastufy.vercel.app",
        methods: ["GET", "POST"],
        credentials: true, // Allow credentials (e.g., cookies)
    },
});
(0, socketHandler_1.default)(io);
app.use("/api/users", userRoute_1.default);
app.use("/api/vendor", vendorRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
