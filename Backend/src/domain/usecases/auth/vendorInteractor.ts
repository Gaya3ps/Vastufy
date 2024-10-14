import { IVendor } from "../../entities/types/vendorTypes";
import { Encrypt } from "../../helper/hashPassword";
import {
  createVendor,
  getVendorbyEmail,
  getVendor,
  getVendorLicense,
  verifyVendorDb,
  saveLicense,
  updateVendorInDB,
  listCategory,
  saveProperty,
  listProperty,
} from "../../../infrastructure/repositories/mongoVendorrepository";
import { log } from "console";
import { generateOTP } from "../../../utils/otpUtils";
import { sendOTPEmail } from "../../../utils/emailUtils";
import {
  getStoredOTP,
  saveOtp,
} from "../../../infrastructure/repositories/mongoUserRepository";
import { generateToken } from "../../helper/jwtHelper";
import {
  LicenseDataRequest,
  LicenseDataResponse,
} from "../../entities/types/licenceType";
import { uploadToS3 } from "../../../utils/s3Uploader";
import { Vendor } from "../../../infrastructure/database/dbModel/vendorModel";
import { listsubCategory } from "../../../infrastructure/repositories/mongoAdminRepository";
import {
  PropertyDataRequest,
  PropertyDataResponse,
} from "../../entities/types/propertyType";
import { PropertyModel } from "../../../infrastructure/database/dbModel/propertyModel";

export default {
  registerVendor: async (vendorData: IVendor) => {
    console.log("Vendor data:", vendorData);
    try {
      if (
        !vendorData.email ||
        !vendorData.name ||
        !vendorData.password ||
        !vendorData.mobileNumber
      ) {
        throw new Error("Vendor data is incomplete");
      }

      const existingVendor = await getVendorbyEmail(vendorData.email);
      console.log("Existing Vendor:", existingVendor);

      if (existingVendor) {
        if (existingVendor.is_verified) {
          throw new Error("Vendor already exists");
        }

        if (!existingVendor.otp_verified) {
          console.log("Generating OTP...");
          const otp = generateOTP();
          console.log("Generated OTP:", otp);

          const generatedAt = Date.now();
          console.log("Sending OTP email...");
          await sendOTPEmail(vendorData.email, otp, vendorData.name);

          console.log("Saving OTP...");
          const savedOtp = await saveOtp(vendorData.email, otp, generatedAt);
          console.log("OTP saved successfully:", savedOtp);

          return {
            message: "OTP generated successfully",
            otpGenerated: true,
            redirectTo: "/vendor/otp-verification",
          };
        } else {
          const getLicense = await getVendorLicense(vendorData.email);
          console.log("Vendor License:", getLicense);

          if (getLicense?.email === vendorData.email) {
            return {
              message:
                "Your license is under verification. Please wait for approval.",
              redirectTo: "/vendor/success",
            };
          }
          console.log("Redirecting to license upload...");
          return {
            message: "Registration success",
            redirectTo: "/vendor/uploadlicense",
          };
        }
      }

      console.log("Generating OTP...");
      const otp = generateOTP();
      console.log("Generated OTP:", otp);

      const generatedAt = Date.now();
      console.log("Sending OTP email...");
      await sendOTPEmail(vendorData.email, otp, vendorData.name);

      console.log("Saving OTP...");
      const savedOtp = await saveOtp(vendorData.email, otp, generatedAt);
      console.log("OTP saved successfully:", savedOtp);

      const hashedPassword = await Encrypt.cryptPassword(vendorData.password);

      const savedVendor = await createVendor({ ...vendorData }, hashedPassword);
      console.log("Saved Vendor:", savedVendor);

      return {
        message: "Vendor registered successfully",
        vendor: savedVendor,
        redirectTo: "/vendor/otp-verification",
      };
    } catch (error: any) {
      console.error("Error during vendor registration:", error);
      throw new Error(error.message || "Registration failed");
    }
  },
  verifyVendor: async (data: { otp: string; email: string }) => {
    console.log("body ", data);

    if (!data.otp) {
      throw new Error("no otp");
    }
    const storedOTP = await getStoredOTP(data.email);
    console.log("1111111111111", storedOTP);

    if (!storedOTP || storedOTP.otp !== data.otp) {
      console.log("invalid otp");
      throw new Error("Invalid Otp");
    }
    const otpGeneratedAt = storedOTP.generatedAt;

    const currentTime = Date.now();
    const otpAge = currentTime - otpGeneratedAt.getTime();
    const expireOTP = 1 * 60 * 1000;
    if (otpAge > expireOTP) {
      throw new Error("OTP Expired");
    }

    return await verifyVendorDb(data.email);
  },

  resendOtp: async (email: string) => {
    try {
      const newOtp = await generateOTP();
      const generatedAt = Date.now();
      const vendors = await getVendorbyEmail(email);
      if (vendors && vendors.name) {
        await sendOTPEmail(email, newOtp, vendors.name);
        log("newOtp:", newOtp);

        await saveOtp(email, newOtp, generatedAt);
      } else {
        throw new Error("Please signup again");
      }
    } catch (error: any) {
      throw new Error("Failed to resend otp");
    }
  },

  loginVendor: async (email: string, password: string) => {
    const existingVendor = await getVendorbyEmail(email);
    console.log("fffffffff", existingVendor);

    const vendors = await getVendor(email);

    if (!existingVendor || !existingVendor.password) {
      throw new Error("User not found");
    }

    const isValid = await Encrypt.comparePassword(
      password,
      existingVendor.password
    );
    if (!isValid) {
      throw new Error("Invalid password");
    }

    if (!vendors) {
      throw new Error("vendor is not found");
    }

    if (!existingVendor.is_verified) {
      throw new Error("Account is not verified");
    }

    if (existingVendor.is_blocked) {
      throw new Error("Account is blocked");
    }

    const role = "vendor";
    const token = await generateToken(existingVendor.id, email, role);
    log("tokenvendor", token);
    const vendor = {
      id: existingVendor.id,
      name: existingVendor.name,
      email: existingVendor.email,
      mobileNumber: existingVendor.mobileNumber,
    };
    return { token, vendor };
  },

  uploadVendorLicense: async (
    licenseData: LicenseDataRequest
  ): Promise<LicenseDataResponse> => {
    const { licenseNumber, email, issueDate, expiryDate, licenseDocument } =
      licenseData;

    // Upload the license document to S3 and get the document URL
    const licenseDocumentResult = await uploadToS3(licenseDocument);
    const licenseDocumentUrl = licenseDocumentResult.Location;

    // Create the complete license data object
    const completeLicenseData = {
      licenseNumber,
      email,
      issueDate,
      expiryDate,
      licenseDocumentUrl,
    };

    // Save the license data to the License model
    const savedLicense = await saveLicense(completeLicenseData);

    // Once the license is saved, update the corresponding vendor with the license ID
    await Vendor.findOneAndUpdate(
      { email: email }, // Find the vendor by email
      { license: savedLicense._id }, // Update the vendor's license field with the saved License ID
      { new: true } // Return the updated document
    );

    console.log(savedLicense, "License saved and associated with vendor.");

    return savedLicense;
  },

  updateVendorProfile: async (
    vendorId: string,
    updatedData: { name: string; mobileNumber: number; address: string }
  ) => {
    try {
      if (
        !updatedData.name ||
        !updatedData.mobileNumber ||
        !updatedData.address
      ) {
        throw new Error("Name , Mobile number and Address are required");
      }
      const updatedVendors = await updateVendorInDB(vendorId, updatedData);
      return updatedVendors;
    } catch (error: any) {
      throw new Error("Failed to update vendor profile");
    }
  },

  getCategories: async () => {
    try {
      const categoryList = await listCategory();
      return categoryList;
    } catch (error) {}
  },

  getSubCategories: async () => {
    try {
      const subCategoryList = await listsubCategory();
      return subCategoryList;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  },

  addVendorProperty: async (
    propertyData: PropertyDataRequest,
    vendorId: string
  ): Promise<PropertyDataResponse> => {
    try {
      const {
        propertyType,
        expectedPrice,
        title,
        description,
        category,
        subcategory,
        ownershipStatus,
        availableStatus,
        saletype: saleType, // Correct to match your model
        ageofproperty: ageOfProperty, // Correct to match your model
        carpetArea,
        builtUpArea,
        plotArea,
        washrooms,
        totalFloors,
        floorNo,
        parking,
        district,
        locality,
        zip,
        address,
        landmark,
        media, // Media files (images/videos)
        amenities, // List of amenities
      } = propertyData;

      // Step 1: Upload media files to S3 and get their URLs
      const mediaUrls: string[] = [];
      for (const file of media) {
        const mediaUploadResult = await uploadToS3(file);
        mediaUrls.push(mediaUploadResult.Location); // Store the URLs of uploaded media files
      }

      // Step 2: Construct and save the property data
      const newProperty = {
        propertyType,
        expectedPrice,
        title,
        description,
        category,
        subcategory,
        ownershipStatus,
        availableStatus,
        saleType, // Match schema
        ageOfProperty, // Match schema
        carpetArea,
        builtUpArea,
        plotArea,
        washrooms,
        totalFloors,
        floorNo,
        parking,
        district,
        locality,
        zip,
        address,
        landmark,
        mediaUrls, // URLs of uploaded media files
        amenities, // Amenities list
        vendor: vendorId, // Associate property with vendor
        createdAt: new Date(),
      };

      // Step 3: Save the property using the repository function
      const savedProperty = await saveProperty(newProperty, vendorId);

      // Step 4: Create and return the PropertyDataResponse object
      const propertyResponse: PropertyDataResponse = {
        propertyType: savedProperty.propertyType,
        expectedPrice: savedProperty.expectedPrice,
        title: savedProperty.title,
        description: savedProperty.description,
        category: savedProperty.category,
        subcategory: savedProperty.subcategory,
        ownershipStatus: savedProperty.ownershipStatus,
        availableStatus: savedProperty.availableStatus,
        saletype: savedProperty.saleType, // Match response format
        ageofproperty: savedProperty.ageOfProperty, // Match response format
        carpetArea: savedProperty.carpetArea,
        builtUpArea: savedProperty.builtUpArea,
        plotArea: savedProperty.plotArea,
        washrooms: savedProperty.washrooms,
        totalFloors: savedProperty.totalFloors,
        floorNo: savedProperty.floorNo,
        parking: savedProperty.parking,
        district: savedProperty.district,
        locality: savedProperty.locality,
        zip: savedProperty.zip,
        address: savedProperty.address,
        landmark: savedProperty.landmark,
        mediaUrls: savedProperty.mediaUrls, // Include uploaded media URLs
        amenities: savedProperty.amenities, // Include amenities
        createdAt: savedProperty.createdAt, // Date property was created
      };

      console.log(savedProperty, "Property saved and associated with vendor.");
      return propertyResponse;
    } catch (error: any) {
      console.error("Error in addVendorProperty:", error);
      throw new Error("Error adding property: " + error.message);
    }
  },

  getPropertyList: async (vendorId: string) => {
    try {
      const propertyList = await listProperty(vendorId);
      return propertyList;
    } catch (error: any) {
      console.error("Error in addVendorProperty:", error);
      throw new Error("Error adding property: " + error.message);
    }
  },
};
