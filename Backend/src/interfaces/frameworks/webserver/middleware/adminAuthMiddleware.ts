import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { Admin } from "../../../../infrastructure/database/dbModel/adminModel";
import { log } from "console";

declare module 'express-serve-static-core' {
    interface Request {
      admin?: any;     
    }
}

export const protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.header("Authorization");

    log(token, 'tokenadmin'); 
   console.log(token, 'tokenadminnnnnnnnnnnnn'); 


    if (token && token.startsWith("Bearer ")) {
        token = token.split(' ')[1]; 
        log(token, 'tokenWithoutBearer'); 

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user: string, email: string, role: string };

            req.admin = decoded;
            const adminId = req.admin.user;

            const admin = await Admin.findById(adminId);
            log('admin found:', admin); 

            if (!admin) {
                log('admin not found');
                res.status(401).json({ message: "admin not found" });
                return;
            }

    

            if(req.admin.role = 'admin'){
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

