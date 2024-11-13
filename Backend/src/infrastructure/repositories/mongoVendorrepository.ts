import {
  IVendor,
  UpdateVendorData,
} from "../../domain/entities/types/vendorTypes";
import { Vendor, VendorDocument } from "../database/dbModel/vendorModel";
import { LicenseModel, License } from "../database/dbModel/licenceModel";
import { LicenseDataResponse } from "../../domain/entities/types/licenceType";
import { log } from "console";
import { Category } from "../database/dbModel/categoryModel";
import { Subcategory } from "../database/dbModel/subCategoryModel";
import { PropertyModel } from "../database/dbModel/propertyModel";
import {
  PropertyDataRequest,
  PropertyDataResponse,
} from "../../domain/entities/types/propertyType";
import { BookingModel } from "../database/dbModel/bookingModel";
import ChatModel from "../database/dbModel/chatModel";
import MessageModel from "../database/dbModel/messageModel";
import { SubscriptionPlanModel } from "../database/dbModel/subscriptionPlanModel";
import { VendorSubscription } from "../database/dbModel/vendorSubscription";

export const createVendor = async (
  vendorData: IVendor,
  hashedPassword: string
) => {
  console.log("vendorData:", vendorData);

  const newVendor = new Vendor({
    name: vendorData.name,
    email: vendorData.email,
    password: hashedPassword,
    mobileNumber: vendorData.mobileNumber,
    is_verified: false,
  });

  console.log("newVendor:", newVendor);

  return await newVendor.save();
};

export const verifyVendorDb = async (email: string) => {
  const vendorData = await Vendor.findOneAndUpdate(
    { email: email },
    { $set: { otp_verified: true } },
    { new: true }
  );
  return vendorData;
};

export const getVendorbyEmail = async (email: string) => {
  return await Vendor.findOne({ email: email });
};

export const getVendor = async (email: string) => {
  return await Vendor.findOne({ email: email });
};

export const verifyVendor = async (email: string) => {
  return await Vendor.findOneAndUpdate(
    { email: email },
    { $set: { is_verified: true } },
    { new: true }
  );
};

export const saveLicense = async (
  licenseData: LicenseDataResponse
): Promise<License> => {
  const license = new LicenseModel(licenseData);
  return await license.save();
};

export const getVendorLicense = async (email: string) => {
  return await LicenseModel.findOne({ email: email });
};

export const getAllVendors = async () => {
  console.log("got vendor");
  // return await Vendor.find({ is_blocked:false},{_id:1,name:1,email:1,city:1,service:1,is_blocked:1})
  return await Vendor.find(
    { is_verified: true, is_blocked: false },
    { _id: 1, name: 1, email: 1, city: 1, service: 1, is_blocked: 1 }
  );
};
interface ServiceType {
  _id: string;
  name: string;
  imageUrl: string;
  is_active: string;
}

export const updateVendor = async (
  id: string,
  data: UpdateVendorData
): Promise<VendorDocument | null> => {
  console.log(id, "😤😤😤");
  try {
    console.log("😤😤😤");
    const updatedVendor = await Vendor.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    console.log(updatedVendor, "😤😤😤");
    return updatedVendor;
  } catch (error: any) {
    throw new Error(`Failed to update vendor: ${error.message}`);
  }
};

export const vendorCount = async (): Promise<number> => {
  try {
    const vendorCount = await Vendor.countDocuments();
    console.log(vendorCount, "vendorcounts");
    return vendorCount;
  } catch (error: any) {
    throw new Error(`Failed to get vendor count: ${error.message}`);
  }
};

export const updateVendorInDB = async (
  vendorId: string,
  updatedData: { name: string; mobileNumber: number; address: string }
) => {
  try {
    const updatedProfile = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        name: updatedData.name,
        mobileNumber: updatedData.mobileNumber,
        address: updatedData.address,
      },
      { new: true }
    );
    return updatedProfile;
  } catch (error: any) {
    throw new Error(`Failed to update vendor: ${error.message}`);
  }
};

export const listCategory = async () => {
  try {
    const listedCategories = await Category.find();
    return listedCategories;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const listsubCategory = async () => {
  try {
    const listedSubCategories = await Subcategory.find();
    return listedSubCategories;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const saveProperty = async (propertyData: any, vendorId: string) => {
  try {
    // Ensure that vendorId is treated correctly
    if (Array.isArray(vendorId)) {
      throw new Error("vendorId should not be an array.");
    }

    // Save the property with the vendor reference
    const newProperty = new PropertyModel({
      ...propertyData,
      vendor: vendorId,
    }); // Use 'vendor' instead of 'vendorId'
    const savedProperty = await newProperty.save();

    await Vendor.findByIdAndUpdate(vendorId, {
      $push: { properties: savedProperty._id },
      $inc: { listingsUsed: 1 }, // Add property to vendor's properties array
    });

    return savedProperty;
  } catch (error: any) {
    console.error("Error saving property:", error);
    throw new Error("Error saving property: " + error.message);
  }
};
export const listProperty = async (vendorId: string) => {
  try {
    const vendor = await Vendor.findById(vendorId).populate({
      path: "properties",
      populate: {
        path: "category", // Populate the category field
        model: "Category", // Assuming Category is the name of the category model
      },
    });
    return vendor;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllProperties = async () => {
  return await PropertyModel.find(
    { is_verified: true }, // Only fetching verified properties
    {
      _id: 1,
      title: 1,
      description: 1,
      category: 1,
      subcategory: 1,
      availableStatus: 1,
      expectedPrice: 1,
      address: 1,
    }
  ).populate("category", "name");
};

export const listBookings = async (vendorId: string) => {
  try {
    // Find bookings by vendorId
    return await BookingModel.find({ vendorId }).populate(
      "propertyId userId vendorId"
    ); // Populating related fields if needed
  } catch (error) {
    console.error("Error fetching bookings from database:", error);
    throw new Error("Database error while fetching bookings");
  }
};

export const updatePropertyInDB = async (
  propertyId: string,
  vendorId: string,
  propertyData: Partial<PropertyDataRequest>
): Promise<PropertyDataResponse | null> => {
  try {
    // Find and update the property belonging to the vendor
    const updatedProperty = await PropertyModel.findOneAndUpdate(
      { _id: propertyId, vendor: vendorId }, // Only update if property belongs to vendor
      { $set: propertyData }, // Update with new property data
      { new: true } // Return the updated document
    ).lean(); // Use lean() to get a plain JavaScript object

    if (!updatedProperty) {
      throw new Error("Property not found or does not belong to this vendor");
    }

    // Cast the updated document to PropertyDataResponse after ensuring required properties are present
    return {
      ...updatedProperty,
      saletype: updatedProperty.saleType ?? "", // Convert or set defaults as needed
      ageofproperty: updatedProperty.ageOfProperty ?? "",
    } as PropertyDataResponse;
  } catch (error: any) {
    console.error("Error updating property:", error);
    throw new Error("Failed to update property: " + error.message);
  }
};

export const getPropertyByIdFromDB = async (propertyId: string) => {
  try {
    // Find the property by its ID and populate category and subcategory details if they exist
    const property = await PropertyModel.findById(propertyId)
      .populate("category", "name") // Populating category with only the name field
      .populate("subcategory", "name"); // Populating subcategory with only the name field

    if (!property) {
      throw new Error(`Property with ID ${propertyId} not found`);
    }

    return property;
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    throw new Error("Failed to fetch property by ID");
  }
};

export const acceptBookingStatus = async (bookingId: string) => {
  try {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { status: "accepted" },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating booking status to accepted:", error);
    throw error;
  }
};

export const rejectBookingStatus = async (bookingId: string) => {
  return await BookingModel.findByIdAndUpdate(
    bookingId,
    { status: "rejected" },
    { new: true }
  );
};

export const fetchChatHistory = async (chatId: string) => {
  try {
    const messages = await MessageModel.find({ chatId })
      .sort({ timestamp: 1 }) // Sort by timestamp to display messages in chronological order
      .lean(); // Use lean for better performance if you’re only reading data

    return messages;
  } catch (error) {
    console.error("Error fetching chat history from database:", error);
    throw new Error("Failed to fetch chat history");
  }
};

export const fetchChatList = async (vendorId: string) => {
  try {
    const chatList = await ChatModel.find({ users: vendorId })
      .populate({
        path: "users",
        match: { _id: { $ne: vendorId } }, // Exclude vendor from the populated users
        select: "name avatar", // Only include necessary fields
      })
      .populate("latestMessage", "message timestamp")
      .exec();

    return chatList;
  } catch (error) {
    console.error("Error fetching chat list from database:", error);
    throw new Error("Failed to fetch chat list");
  }
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  message: string,
  recipientId: string,
  senderModel: "User" | "Vendor",
  recipientModel: "User" | "Vendor"
) => {
  try {
    // Create a new message document
    const newMessage = await MessageModel.create({
      chatId,
      senderId,
      recipientId,
      senderModel,
      recipientModel,
      message,
      timestamp: new Date(),
    });

    console.log("Message saved to database:", newMessage);
    return newMessage;
  } catch (error) {
    console.error("Error saving message to database:", error);
    throw error;
  }
};

export const getVendorSubscription = async (vendorId: string) => {
  try {
    // Fetch all subscriptions associated with the vendor and populate each subscription's details
    const vendorSubscriptions = await VendorSubscription.find({
      vendor: vendorId,
    }).populate<{ subscription: { maxListings: number } }>("subscription");

    // Fetch vendor data regardless of subscription status
    const vendor = await Vendor.findById(vendorId).select(
      "maxListings listingsUsed"
    );

    if (!vendor) {
      return null;
    }

    // Initialize the maxListings with the vendor's base maxListings
    let maxListings = vendor.maxListings;
    const listingsUsed = vendor.listingsUsed;

    // Sum up maxListings from all the vendor's subscriptions if they exist
    vendorSubscriptions.forEach((vendorSubscription) => {
      if (vendorSubscription.subscription) {
        maxListings += vendorSubscription.subscription.maxListings;
      }
    });

    return {
      maxListings,
      listingsUsed,
    };
  } catch (error) {
    console.error("Error in getVendorSubscription:", error);
    throw error;
  }
};

export const listedSubscriptionPlans = async () => {
  try {
    // Query the database for subscription plans with status set to true
    const listedPlans = await SubscriptionPlanModel.find({ status: true });
    return listedPlans;
  } catch (error) {
    throw new Error(
      "Failed to fetch listed subscription plans from the database"
    );
  }
};

export const addVendorToSubscription = async (
  sessionId: string,
  subscriptionId: string,
  vendorId: string
) => {
  try {
    // Check if the vendor already has a subscription to avoid duplicates
    const existingSubscription = await VendorSubscription.findOne({
      vendor: vendorId,
      subscription: subscriptionId,
    });

    if (existingSubscription) {
      console.log("Vendor already subscribed to this plan.");
      return {
        success: false,
        message: "Vendor already subscribed to this plan.",
      };
    }

    // Create a new VendorSubscription document
    const newVendorSubscription = new VendorSubscription({
      vendor: vendorId,
      subscription: subscriptionId,
      purchaseDate: new Date(),
      stripeSessionId: sessionId,
    });

    // Save the new subscription
    await newVendorSubscription.save();
    return { success: true, message: "Subscription added successfully" };
  } catch (error) {
    console.error("Repository Error:", error);
    return { success: false, message: "Error saving subscription to database" };
  }
};

export const fetchSubscribedPlan = async (vendorId: string) => {
  try {
    // Find the subscription linked to the vendor, then populate the subscription details
    const subscribedPlan = await VendorSubscription.findOne({
      vendor: vendorId,
    })
      .populate({
        path: "subscription",
        model: SubscriptionPlanModel,
        select: "planName price features maxListings prioritySupport", // Only select needed fields
      })
      .exec();

    return subscribedPlan;
  } catch (error) {
    console.error("Error fetching subscribed plan from database:", error);
    throw error;
  }
};
