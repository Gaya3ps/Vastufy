import { hash } from "crypto";
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
import { Property, PropertyModel } from "../database/dbModel/propertyModel";
import {
  PropertyDataRequest,
  PropertyDataResponse,
} from "../../domain/entities/types/propertyType";

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
    const newProperty = new PropertyModel({ ...propertyData, vendor: vendorId }); // Use 'vendor' instead of 'vendorId'
    const savedProperty = await newProperty.save();

    await Vendor.findByIdAndUpdate(vendorId, {
        $push: { properties: savedProperty._id },  // Add property to vendor's properties array
      });

    return savedProperty;
  } catch (error: any) {
    console.error("Error saving property:", error);
    throw new Error("Error saving property: " + error.message);
  }
};

export const listProperty = async (vendorId: string) => {
    try {
        console.log(vendorId,"nsjbsbsbhjsbhjsb");
        
      // Find properties by the vendor field (vendorId)
    //   const listedProperties = await PropertyModel.find(
    //     
    //   ).populate("category");
    const vendor = await Vendor.findById(vendorId).populate('properties');
  
      console.log(vendor, "Filtered properties by vendorId");
  
      return vendor ;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  
