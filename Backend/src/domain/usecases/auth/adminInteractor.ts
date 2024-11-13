import { generateToken } from "../../helper/jwtHelper";
import { IUser, PaginatedUsers } from "../../entities/types/userType";
import {
  addCategoryToDB,
  addSubCategoryToDB,
  addSubscriptionPlanToDB,
  changeToggleStatus,
  deleteCategoryInDB,
  deletesubCategoryInDB,
  editCategoryInDB,
  editSubCategoryInDB,
  findAdmin,
  getAllUsers,
  getPaginatedUsers,
  getPaginatedVendors,
  getPropertyById,
  getVendorById,
  listCategory,
  listsubCategory,
  listSubscriptionPlans,
  propertyList,
  updatePropertyVerificationStatus,
  updateUserStatus,
  updateVendorStatus,
  updateVendorVerificationStatus,
} from "../../../infrastructure/repositories/mongoAdminRepository";
import { Encrypt } from "../../helper/hashPassword";
import { log } from "console";
import { ICategory } from "../../entities/categoryType";
import { SubscriptionPlanModel } from "../../../infrastructure/database/dbModel/subscriptionPlanModel";

export default {
  loginAdmin: async (cred: { email: string; password: string }) => {
    try {
      const admin = await findAdmin(cred.email);
      console.log("admin isssss", admin);

      if (!admin || !admin.password) {
        throw new Error("Admin not found or password is missing");
      }
      const isValid = await Encrypt.comparePassword(
        cred.password,
        admin.password
      );
      if (!isValid) {
        throw new Error("Invalid password");
      }
      const role = "admin";
      const tokenData = await generateToken(admin.id, cred.email, role);
      return {
        admin,
        token: tokenData.token,
        refreshToken: tokenData.refreshToken,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        throw error;
      } else {
        console.error("An unknown error occurred");
        throw new Error("An unknown error occurred");
      }
    }
  },

  userList: async () => {
    const users = getAllUsers();
    return users;
  },
  getUsers: async (page: number, limit: number): Promise<PaginatedUsers> => {
    try {
      const users = await getPaginatedUsers(page, limit);
      return users;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  updatedUserStatus: async (
    userId: string,
    is_blocked: boolean
  ): Promise<IUser | null> => {
    try {
      const updatedUser = await updateUserStatus(userId, is_blocked);
      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getVendors: async (page: number, limit: number) => {
    try {
      const vendors = await getPaginatedVendors(page, limit);
      return vendors;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  fetchVendorById: async (id: string) => {
    try {
      const vendor = await getVendorById(id);
      return vendor;
    } catch (error) {
      console.error("Error fetching vendor by id:", error);
      throw new Error("Failed to fetch vendor");
    }
  },
  updatedVendorStatus: async (
    vendorId: string,
    is_blocked: boolean
  ): Promise<IUser | null> => {
    try {
      const updatedVendor = await updateVendorStatus(vendorId, is_blocked);
      return updatedVendor;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  verifyVendor: async (id: string, is_verified: boolean) => {
    try {
      const updated = await updateVendorVerificationStatus(id, is_verified);
      return updated;
    } catch (error) {
      console.error("Error verifying vendor:", error);
      throw new Error("Failed to verify vendor");
    }
  },
  addCategory: async (newCategoryData: {
    name: string;
    description: string;
  }) => {
    try {
      if (!newCategoryData.name) {
        throw new Error("Category name is required");
      }

      // Save the new category to the database
      const newCategory = await addCategoryToDB(newCategoryData);

      // Return the newly created category
      return newCategory;
    } catch (error) {
      // Re-throw error for proper handling
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  },
  getCategories: async () => {
    try {
      const categoryList = await listCategory();
      return categoryList;
    } catch (error) {}
  },
  editedCategory: async (
    id: string,
    editedCategoryData: { name: string; description: string }
  ) => {
    try {
      if (!editedCategoryData.name || !id) {
        throw new Error("Category name is required");
      }

      const categoryEdited = await editCategoryInDB(id, editedCategoryData);
      return categoryEdited;
    } catch (error) {
      // Re-throw error for proper handling
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  },

  deletedCategory: async (id: string) => {
    try {
      if (!id) {
        throw new Error("Category id is required");
      }
      const categoryDeleted = await deleteCategoryInDB(id);
      return categoryDeleted;
    } catch (error) {
      // Re-throw error for proper handling
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  },

  addSubcategory: async (newSubcategory: {
    name: string;
    categoryId: string;
  }) => {
    try {
      if (!newSubcategory.name || !newSubcategory.categoryId) {
        throw new Error("Subcategory name and category id is required");
      }
      const newSubCategory = await addSubCategoryToDB(newSubcategory);
      return newSubCategory;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
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

  editSubCategory: async (
    id: string,
    editedSubCategoryData: { name: string; categoryId: string }
  ) => {
    try {
      if (
        !id ||
        !editedSubCategoryData.name ||
        !editedSubCategoryData.categoryId
      ) {
        throw new Error("CategoryId, name, id is required");
      }
      const subCategoryEdited = await editSubCategoryInDB(
        id,
        editedSubCategoryData
      );
      return subCategoryEdited;
    } catch (error) {
      // Re-throw error for proper handling
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  },

  deletedSubCategory: async (id: string) => {
    try {
      if (!id) {
        throw new Error("Subcategory id is required");
      }
      const subCategoryDeleted = await deletesubCategoryInDB(id);
      return subCategoryDeleted;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  },

  // getPropertyList : async()=>{
  //   try {
  //     const properties = await listProperties();
  //     return properties;
  //   } catch (error) {
  //     throw new Error(
  //       error instanceof Error ? error.message : "Unknown error occurred"
  //     );
  //   }
  // },

  verifyProperties : async() => {
    try {
      const properties = await propertyList();
      return properties;
    } catch (error) {
      console.error("Error verifying vendor:", error);
      throw new Error("Failed to verify vendor");
        }
  },

  
  fetchPropertyById: async (propertyId: string) => {

    try {
      const property = await getPropertyById(propertyId);
      console.log(property,"chukuchuku");
      
      return property;
    } catch (error) {
      console.error("Error fetching vendor by id:", error);
      throw new Error("Failed to fetch vendor");
    }
  },

  verifyProperty: async (id: string, is_verified: boolean) => {
    try {
      const updatedProperty = await updatePropertyVerificationStatus(id, is_verified);
      return updatedProperty;
    } catch (error) {
      console.error("Error verifying vendor:", error);
      throw new Error("Failed to verify vendor");
    }
  },


  addSubscriptionPlan: async (subscriptionData: {
    planName: string;
    price: number;
    features: string;
    maxListings: number;
    prioritySupport: boolean;
  }) => {
    try {
      const formattedSubscriptionData = {
        ...subscriptionData,
        prioritySupport: subscriptionData.prioritySupport ? 'yes' : 'no', // Boolean to string conversion
      };

      // Delegate to the repository to add the subscription plan
      const savedSubscriptionPlan = await addSubscriptionPlanToDB(subscriptionData);
      return savedSubscriptionPlan;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
    }
  },

  getAllSubscriptionPlans:async () => {
    try {
      const subscriptionPlans = await listSubscriptionPlans();
      return subscriptionPlans;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
},


toggleStatus: async (planId: string, status: boolean) => {
  try {
    const updatedPlan = await SubscriptionPlanModel.findByIdAndUpdate(
      planId,
      { status },
      { new: true } 
    );
    return updatedPlan;
  } catch (error) {
    console.error('Error updating subscription plan status:', error);
    throw new Error('Failed to update status');
  }
}


}