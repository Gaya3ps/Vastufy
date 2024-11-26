import { NextFunction, Request, Response } from "express";
import vendorInteractor from "../../domain/usecases/auth/vendorInteractor";
import { error, log } from "console";
import { Vendor } from "../../infrastructure/database/dbModel/vendorModel";
import { LicenseDataRequest } from "../../domain/entities/types/licenceType";
import { updateVendor } from "../../infrastructure/repositories/mongoVendorrepository";
import mongoose from "mongoose";
import adminInteractor from "../../domain/usecases/auth/adminInteractor";
import { PropertyDataRequest } from "../../domain/entities/types/propertyType";
import { uploadToS3 } from "../../utils/s3Uploader";
import { PropertyModel } from "../../infrastructure/database/dbModel/propertyModel";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY as string, {});

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
      console.log(req.body, "Received form data");
      const vendorId = Array.isArray(req.query.vendorId)
        ? req.query.vendorId[0]
        : (req.query.vendorId as string);
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
        city,
        locality,
        zip,
        address,
        landmark,
        bedrooms,
        balconies,
        furnishingStatus,
        powerBackup,
        roadAccessibility,
        locationAdvantages,
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
        city,
        locality,
        zip,
        address,
        landmark,
        media, // Pass the media files
        bedrooms,
        balconies,
        furnishingStatus,
        powerBackup,
        roadAccessibility,
        locationAdvantages: locationAdvantages || [],
        amenities: amenities || [], // Default to empty array if no amenities
      };

      // Call the interactor to save the property
      const savedProperty = await vendorInteractor.addVendorProperty(
        propertyData,
        vendorId
      );

      // Return a success response
      res.status(200).json({
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

  getBookings: async (req: Request, res: Response) => {
    try {
      const vendorId = req.params.vendorId;

      // Check if vendorId is provided
      if (!vendorId) {
        return res.status(400).json({ error: "Vendor ID is required" });
      }

      // Call the interactor to get the booking list
      const bookingList = await vendorInteractor.getBookingList(vendorId);

      // Respond with the booking list
      return res.status(200).json(bookingList);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }
  },

  // New updateProperty method
  updateProperty: async (req: Request, res: Response) => {
    try {
      console.log("reach aaaaay");

      const { propertyId } = req.params;
      const vendorId = req.query.vendorId as string;

      if (!propertyId) {
        return res.status(400).json({ message: "Property ID is required" });
      }
      if (!vendorId) {
        return res.status(400).json({ message: "Vendor ID is required" });
      }

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
        city,
        locality,
        zip,
        address,
        landmark,
        bedrooms,
        balconies,
        furnishingStatus,
        powerBackup,
        roadAccessibility,
        locationAdvantages,
        amenities,
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const media = files?.media || [];

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
        city,
        locality,
        zip,
        address,
        landmark,
        media,
        bedrooms,
        balconies,
        furnishingStatus,
        powerBackup,
        roadAccessibility,
        locationAdvantages: locationAdvantages || [],
        amenities: amenities || [],
      };

      const updatedProperty = await vendorInteractor.updateVendorProperty(
        propertyId,
        vendorId,
        propertyData
      );

      res.status(200).json({
        message: "Property updated successfully",
        property: updatedProperty,
      });
    } catch (error: any) {
      console.error("Error in updateProperty:", error);
      res.status(500).json({
        message: "Failed to update property",
        error: error.message,
      });
    }
  },

  // edit property
  //  updateProperty : async (req: Request, res: Response) => {
  //     try {
  //       console.log('reach aaaaay');

  //       const { propertyId } = req.params;
  //       const vendorId = req.query.vendorId as string;

  //       if (!propertyId) {
  //         return res.status(400).json({ message: 'Property ID is required' });
  //       }
  //       if (!vendorId) {
  //         return res.status(400).json({ message: 'Vendor ID is required' });
  //       }

  //       const {
  //         propertyType,
  //         expectedPrice,
  //         title,
  //         description,
  //         category,
  //         subcategory,
  //         ownershipStatus,
  //         availableStatus,
  //         saletype,
  //         ageofproperty,
  //         carpetArea,
  //         builtUpArea,
  //         plotArea,
  //         totalFloors,
  //         floorNo,
  //         parking,
  //         washrooms,
  //         district,
  //         city,
  //         locality,
  //         zip,
  //         address,
  //         landmark,
  //         bedrooms,
  //         balconies,
  //         furnishingStatus,
  //         powerBackup,
  //         roadAccessibility,
  //         locationAdvantages,
  //         amenities,
  //       } = req.body;

  //       console.log(category,'hhhhhhhhhhhhhhhhhhhhhhh');

  //       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  //       const media = files?.media || [];

  //       // Step 1: Upload media files to S3 and get their URLs if new media files are provided
  //       const mediaUrls: string[] = [];
  //       for (const file of media) {
  //         const mediaUploadResult = await uploadToS3(file);
  //         mediaUrls.push(mediaUploadResult.Location);
  //       }

  //       // Step 2: Build the property data
  //       const propertyData = {
  //         propertyType,
  //         expectedPrice,
  //         title,
  //         description,
  //         category,
  //         subcategory,
  //         ownershipStatus,
  //         availableStatus,
  //         saletype,
  //         ageofproperty,
  //         carpetArea,
  //         builtUpArea,
  //         plotArea,
  //         totalFloors,
  //         floorNo,
  //         parking,
  //         washrooms,
  //         district,
  //         city,
  //         locality,
  //         zip,
  //         address,
  //         landmark,
  //         bedrooms,
  //         balconies,
  //         furnishingStatus,
  //         powerBackup,
  //         roadAccessibility,
  //         locationAdvantages: locationAdvantages || [],
  //         amenities: amenities || [],
  //         mediaUrls,
  //       };

  //       // Step 3: Convert category ID to ObjectId if necessary
  //       if (propertyData.category && typeof propertyData.category === 'object' && '_id' in propertyData.category) {
  //         propertyData.category = new mongoose.Types.ObjectId((propertyData.category as any)._id);
  //       } else if (typeof propertyData.category === 'string' && mongoose.Types.ObjectId.isValid(propertyData.category)) {
  //         propertyData.category = new mongoose.Types.ObjectId(propertyData.category);
  //       } else {
  //         throw new Error('Invalid category ID format');
  //       }

  //       // Step 4: Update the property in the database
  //       const updatedProperty = await PropertyModel.findOneAndUpdate(
  //         { _id: propertyId, vendor: vendorId },
  //         { $set: propertyData },
  //         { new: true }
  //       ).lean();

  //       if (!updatedProperty) {
  //         throw new Error('Property not found or does not belong to this vendor');
  //       }

  //       // Step 5: Respond with the updated property data
  //       res.status(200).json({
  //         message: 'Property updated successfully',
  //         property: updatedProperty,
  //       });
  //     } catch (error: any) {
  //       console.error('Error in updateProperty:', error);
  //       res.status(500).json({
  //         message: 'Failed to update property',
  //         error: error.message,
  //       });
  //     }
  //   },

  getPropertyById: async (req: Request, res: Response) => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    try {
      const { id } = req.params;
      console.log(id, "this is idd");
      const property = await vendorInteractor.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      console.log("Property in controller hereeee:", property);
      res
        .status(200)
        .json({ message: "Fetched property successfully", property });
    } catch (error: any) {
      console.error("Error fetching property:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch property", error: error.message });
    }
  },

  // Controller function to accept a booking
  acceptBooking: async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    try {
      const acceptedBooking = await vendorInteractor.updateBookingStatusAccept(
        bookingId
      );
      res
        .status(200)
        .json({ message: "Booking accepted", booking: acceptedBooking });
    } catch (error) {
      console.error("Error accepting booking:", error);
      res.status(500).json({ error: "Failed to accept booking" });
    }
  },

  rejectBooking: async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    try {
      const rejectedBooking = await vendorInteractor.updateBookingStatusReject(
        bookingId
      );
      res
        .status(200)
        .json({
          message: "Booking rejected successfully",
          booking: rejectedBooking,
        });
    } catch (error) {
      console.error("Failed to reject booking:", error);
      res.status(500).json({ error: "Failed to reject booking" });
    }
  },

  fetchChatHistory: async (req: Request, res: Response) => {
    const { chatId } = req.params;
    console.log("Fetching chat history for chatId:", chatId);

    try {
      const chatHistory = await vendorInteractor.getChatHistory(chatId);
      res.status(200).json({ messages: chatHistory });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  },

  fetchChatList: async (req: Request, res: Response) => {
    const { vendorId } = req.params;
    console.log("rattttttttttt", vendorId);

    try {
      const chatList = await vendorInteractor.getChatList(vendorId);
      res.status(200).json(chatList);
    } catch (error) {
      console.error("Error in fetching chat list from controller:", error);
      res.status(500).json({ message: "Failed to fetch chat list" });
    }
  },

  sendMessage: async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { senderId, recipientId, senderModel, recipientModel, message } =
      req.body;

    console.log("Received chat ID:", chatId);
    console.log("Request body data:", req.body);

    // Validate the data
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      console.error("Invalid recipientId:", recipientId);
      return res.status(400).json({ message: "Invalid recipientId" });
    }

    if (!["User", "Vendor"].includes(recipientModel)) {
      console.error("Invalid recipientModel:", recipientModel);
      return res.status(400).json({ message: "Invalid recipientModel" });
    }

    try {
      const sentMessage = await vendorInteractor.sendMessage(
        chatId,
        senderId,
        message,
        recipientId,
        senderModel,
        recipientModel
      );

      res
        .status(200)
        .json({ message: "Message sent successfully", sentMessage });
    } catch (error) {
      console.error("Error in sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  },

  getVendorSubscription: async (req: Request, res: Response) => {
    try {
      const { vendorId } = req.params;
      const vendorSubscription = await vendorInteractor.vendorSubscription(
        vendorId
      );

      if (!vendorSubscription) {
        return res
          .status(404)
          .json({ message: "Vendor subscription not found" });
      }

      res.json(vendorSubscription);
    } catch (error) {
      console.error("Error fetching vendor subscription:", error);
      res.status(500).json({ message: "Error fetching subscription data" });
    }
  },

  getListedSubscriptionPlans: async (req: Request, res: Response) => {
    try {
      const listedPlans = await vendorInteractor.listedSubscriptionPlans();
      res.status(200).json(listedPlans);
    } catch (error) {
      console.error("Error fetching listed subscription plans:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch listed subscription plans" });
    }
  },

  buySubscription: async (req: Request, res: Response) => {
    try {
      const { subscriptionId, planName, price, vendorId } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: { name: planName },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/vendor/subscription-success?session_id={CHECKOUT_SESSION_ID}&subscriptionId=${subscriptionId}&vendorId=${vendorId}`, // Redirect to success page on your frontend // Redirect to success page on your frontend
        cancel_url: `${process.env.CLIENT_URL}/vendor/subscription-failed`, // Redirect to cancel page on your frontend
        metadata: {
          subscriptionId,
          vendorId,
        },
      });

      if (!session) {
        throw new Error("Failed to create Stripe session.");
      }

      // Return session ID to the frontend
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ error: "Failed to create Stripe session" });
    }
  },

  addVendorToSubscription: async (req: Request, res: Response) => {
    try {
      const { sessionId, subscriptionId, vendorId } = req.body;

      // Call the interactor to handle the business logic
      const result = await vendorInteractor.addVendorToSubscription(
        sessionId,
        subscriptionId,
        vendorId
      );

      // Check if the subscription was successfully added
      if (result.success) {
        res.status(200).json({
          success: true,
          message: "Vendor successfully added to the subscription",
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || "Failed to add vendor to subscription",
        });
      }
    } catch (error) {
      console.error("Error adding vendor to subscription:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  subscribedPlan: async (req: Request, res: Response) => {
    try {
      const { vendorId } = req.params;
      const subscribedPlan = await vendorInteractor.listSubscribedPlan(
        vendorId
      );
      res.status(200).json(subscribedPlan);
    } catch (error) {
      console.error("Error fetching subscribed plan:", error);
      res.status(500).json({ error: "Failed to fetch subscribed plan" });
    }
  },

  getVendorCount: async (req: Request, res: Response) => {
    try {
      const count = await vendorInteractor.vendorCount();
      res.status(200).json({ count }); // Returns { count: <number> }
    } catch (error) {
      console.error("Error fetching vendor count:", error);
      res.status(500).json({ error: "Failed to fetch vendor count" });
    }
  },

  getPropertyCount: async (req: Request, res: Response) => {
    try {
      const { vendorId } = req.params;  
      console.log(req.params,"huhmmmmm");
      
      const count = await vendorInteractor.propertyCount(vendorId);  // Pass vendorId to the interactor
      res.json({ count });
    } catch (error) {
      console.error("Error fetching property count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  getChatCount: async (req: Request, res: Response) => {
    try {
      const { vendorId } = req.params;  // Get vendorId from the URL path
      console.log(req.params, "Fetching chat count for vendor");

      // Pass the vendorId to the interactor to get the count
      const count = await vendorInteractor.chatCount(vendorId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching chat count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getSubscriptionRevenue: async (req: Request, res: Response) => {
    try {
      const revenueData = await vendorInteractor.subscriptionRevenue();
      res.status(200).json(revenueData); // Send the data as JSON response
    } catch (error) {
      console.error("Error fetching subscription revenue:", error);
      res.status(500).json({ error: "Failed to fetch subscription revenue data" });
    }
  }


};
