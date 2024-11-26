"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetToken = exports.generateResetToken = exports.generateToken = void 0;
const jwt = require('jsonwebtoken');
const SECRET_KEY = "YOUR_SECRET_KEY";
const REFRESH_SECRET_KEY = "REFRESH_SECRET_KEY";
const generateToken = (user, email, role) => {
    const token = jwt.sign({ user: user, email: email, role: role }, SECRET_KEY, {
        expiresIn: '2h'
    });
    const refreshToken = jwt.sign({ user: user, email: email, role: role }, REFRESH_SECRET_KEY, {
        expiresIn: '5d',
    });
    return { token, refreshToken };
};
exports.generateToken = generateToken;
const generateResetToken = (email) => {
    const resetToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '15m' }); // Short expiration
    return resetToken;
};
exports.generateResetToken = generateResetToken;
// Token Validation Function
const validateResetToken = (token, email) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Check if the token's email matches the user's email
        if (decoded.email !== email) {
            throw new Error("Token validation failed: Email mismatch");
        }
        return true; // Token is valid
    }
    catch (error) {
        console.error("Token validation error:", error);
        return false; // Token is invalid
    }
};
exports.validateResetToken = validateResetToken;
