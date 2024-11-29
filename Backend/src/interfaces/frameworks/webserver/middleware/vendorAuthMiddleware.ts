
import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { log } from "console";
import { Vendor } from "../../../../infrastructure/database/dbModel/vendorModel";

declare module 'express-serve-static-core' {
    interface Request {
      vendor?: any;     
    }
}

export const protectVendor = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.header("Authorization");

    log(token, 'token8086'); 

    if (token && token.startsWith("Bearer ")) {
        token = token.split(' ')[1]; 
        log(token, 'tokenWithoutBearer'); 

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user: string, email: string, role: string };
            log(decoded, "decoded"); 

            req.vendor = decoded;
            const vendorId = req.vendor.user;
            log(vendorId, "usvendorIderId"); 

            const vendor = await Vendor.findById(vendorId);
            log('User found:', vendor); 

            if (!vendor) {
                log('User not found');
                res.status(401).json({ message: "User not found" });
                return;
            }

            if(req.vendor.role = 'vendor'){
                next();
            }
        } catch (error) {
            log(error, 'JWT verification error'); 
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: "Token expired" });
            } else {
                res.status(401).json({ message: "Not authorized, invalid token" });
            }
        }
    } else {
        log('No token provided'); 
        res.status(401).json({ message: "Not authorized, no token" });
    }
};