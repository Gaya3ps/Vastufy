import { NextFunction, Request, Response } from "express";
import vendorInteractor from "../../domain/usecases/auth/vendorInteractor";
import { error, log } from "console";
import { Vendor } from "../../infrastructure/database/dbModel/vendorModel";
import { LicenseDataRequest } from "../../domain/entities/types/licenceType";
import { updateVendor } from "../../infrastructure/repositories/mongoVendorrepository";
import mongoose from "mongoose";
import adminInteractor from "../../domain/usecases/auth/adminInteractor";
import { PropertyDataRequest } from "../../domain/entities/types/propertyType";

export default {
  vendorRegister: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, mobileNumber } = req.body;
      console.log(req.body, "vendorsign");
      const vendor = await vendorInteractor.registerVendor(req.body);
      res.status(200).json({ message: "Registration success", vendor });
    } catch (error) {
      console.log(error);
    }
  },
  verifyOTP: async (req: Request, res: Response, next: NextFunction) => {
    console.log("otp", req.body);

    try {
      const response = await vendorInteractor.verifyVendor(req.body);
      console.log("verifyOTP", response);
      res.status(200).json({ message: "Verify Success", response });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
      next(error);
    }
  },

  resendOtp: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const response = await vendorInteractor.resendOtp(email);
      res.status(200).json({ response });
    } catch (error: any) {
      res.status(500).json(error);
    }
  },

  vendorLogin: async (req: Request, res: Response) => {
    console.log("logindata", req.body);

    try {
      const { email, password } = req.body;
      // console.log(req.body);

      const response = await vendorInteractor.loginVendor(email, password);
      res.status(200).json({ message: "Login success", response });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },

  licenseUpload: async (req: Request, res: Response) => {
    try {
      const { licenseNumber, email, issueDate, expiryDate } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const licenseDocument = files?.licenseDocument?.[0];
      const logo = files?.logo?.[0];

      if (!licenseDocument) {
        console.error("License document is missing.");
        return res
          .status(400)
          .json({ message: "License document is required" });
      }

      const licenseData: LicenseDataRequest = {
        licenseNumber,
        email,
        issueDate,
        expiryDate,
        licenseDocument,
      };
      const result = await vendorInteractor.uploadVendorLicense(licenseData);

      res
        .status(200)
        .json({ message: "License and logo uploaded successfully", result });
    } catch (error: any) {
      console.error("Error in licenseUpload:", error);
      res.status(500).json({
        message: "Error uploading license and logo",
        error: error.message,
      });
    }
  },
  getLicenseNumber: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // console.log(id);
      const vendor = await Vendor.findById(id).populate("license");
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updateVendorProfile: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // console.log(id, "got the id hereee");
      // console.log(req.body);
      const { name, mobileNumber, address } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Vendor ID is required" });
      }
      if (!name || !address || !mobileNumber) {
        return res.status(400).json({
          error: "Vendor name, mobile number and address is required",
        });
      }

      const updatedVendorProfile = await vendorInteractor.updateVendorProfile(
        id,
        { name, mobileNumber, address }
      );
      res.status(200).json({
        message: "Vendor profile updated successfully",
        updatedVendorProfile,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await vendorInteractor.getCategories();
      return res
        .status(200)
        .json({ message: "Fetched categories successfully", categories });
    } catch (error) {
      console.error("Error getting category", error);
      res.status(500).json({ error: "Failed to get category" });
    }
  },

  getSubCategories: async (req: Request, res: Response) => {
    try {
      const subCategories = await vendorInteractor.getSubCategories();
      return res
        .status(200)
        .json({ message: "Fetched subcategories successfully", subCategories });
    } catch (error) {
      console.error("Error getting subcategory", error);
      res.status(500).json({ error: "Failed to get subcategory" });
    }
  },

  addProperty: async (req: Request, res: Response) => {
    try {
      // console.log(req.body, "Received form data");
      const vendorId = Array.isArray(req.query.vendorId)
        ? req.query.vendorId[0]
        : (req.query.vendorId as string);
      // console.log(vendorId, "blaaaaaaaaaaah");

      // Extract property details from the request body
      const {
        propertyType,
        expectedPrice,
        title,
        description,
        category,
        subcategory,
        ownershipStatus,
        availableStatus,
        saletype,
        ageofproperty,
        carpetArea,
        builtUpArea,
        plotArea,
        totalFloors,
        floorNo,
        parking,
        washrooms,
        district,
        locality,
        zip,
        address,
        landmark,
        amenities,
      } = req.body;
      if (!vendorId || typeof vendorId !== "string") {
        return res.status(400).json({ message: "Invalid Vendor ID" });
      }

      // Validate the vendorId (ensure it's a single string, not an array)

      // Handle file uploads (assuming Multer is used for file handling)
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const media = files?.media || []; // Get the media files from the request

      if (media.length === 0) {
        // If no media files were uploaded, return an error
        return res
          .status(400)
          .json({ message: "At least one property image (media) is required" });
      }

      // Construct property data
      const propertyData: PropertyDataRequest = {
        propertyType,
        expectedPrice,
        title,
        description,
        category,
        subcategory,
        ownershipStatus,
        availableStatus,
        saletype,
        ageofproperty,
        carpetArea,
        builtUpArea,
        plotArea,
        totalFloors,
        floorNo,
        parking,
        washrooms,
        district,
        locality,
        zip,
        address,
        landmark,
        media, // Pass the media files
        amenities: amenities || [], // Default to empty array if no amenities
      };

      // Call the interactor to save the property
      const savedProperty = await vendorInteractor.addVendorProperty(
        propertyData,
        vendorId
      );

      // Return a success response
      res
        .status(200)
        .json({
          message: "Property added successfully",
          property: savedProperty,
        });
    } catch (error: any) {
      console.error("Error in addProperty:", error);
      res.status(500).json({
        message: "Failed to add property",
        error: error.message,
      });
    }
  },

  getProperties: async (req: Request, res: Response) => {
    try {
      const vendorId = req.params.vendorId;
      if (!vendorId) {
        return res.status(400).json({ error: "Vendor ID is required" });
      }
      const properties = await vendorInteractor.getPropertyList(vendorId);
      return res
        .status(200)
        .json({ message: "Fetched propertied successfully", properties });
    } catch (error) {
      console.error("Error getting properties", error);
      res.status(500).json({ error: "Failed to get category" });
    }
  },
};
