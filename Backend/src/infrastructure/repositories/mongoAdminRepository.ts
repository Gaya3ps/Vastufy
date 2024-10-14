import { Admin } from "../database/dbModel/adminModel";
import { Users } from "../database/dbModel/userModel";
import { IUser, PaginatedUsers } from "../../domain/entities/types/userType";
import { Vendor } from "../database/dbModel/vendorModel";
import { log } from "console";
import { Category } from "../database/dbModel/categoryModel";
import { Subcategory } from "../database/dbModel/subCategoryModel";
import { PropertyModel } from "../database/dbModel/propertyModel";

export const findAdmin = async (email: string) => {
  return await Admin.findOne({ email });
};

export const getAllUsers = async () => {
  try {
    return await Users.find();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getPaginatedUsers = async (
  page: number,
  limit: number
): Promise<PaginatedUsers> => {
  try {
    const users = await Users.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalUsers = await Users.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getPaginatedVendors = async (page: number, limit: number) => {
  try {
    const vendors = await Vendor.find({ is_verified: false })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalVendors = await Vendor.countDocuments();
    const totalPages = Math.ceil(totalVendors / limit);

    return {
      vendors,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserStatus = async (
  userId: string,
  isBlocked: boolean
): Promise<IUser | null> => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { is_blocked: isBlocked },
      { new: true }
    );
    return updatedUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getVendorById = async (id: string) => {
  return await Vendor.findById(id);
};

export const updateVendorStatus = async (
  vendorId: string,
  isBlocked: boolean
): Promise<IUser | null> => {
  try {
    const updatedVndor = await Vendor.findByIdAndUpdate(
      vendorId,
      { is_blocked: isBlocked },
      { new: true }
    );
    log(updatedVndor, "upvendor");
    return updatedVndor;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUnverifiedVendors = async (page: number, limit: number) => {
  const vendors = await Vendor.find({ is_verified: false })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalVendors = await Vendor.countDocuments();
  return {
    vendors,
    totalPages: Math.ceil(totalVendors / limit),
  };
};

export const updateVendorVerificationStatus = async (
  id: string,
  is_verified: boolean
) => {
  return await Vendor.findByIdAndUpdate(
    id,
    { is_verified: true },
    { new: true }
  );
};

export const addCategoryToDB = async (newCategoryData: {
  name: string;
  description: string;
}) => {
  try {
    const newCategory = new Category({
      name: newCategoryData.name,
      description: newCategoryData.description,
    });

    const savedCategory = await newCategory.save();
    return savedCategory;
  } catch (error: any) {
    throw new Error(error.message);
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

export const editCategoryInDB = async (
  id: string,
  editedCategoryData: {
    name: string;
    description: string;
  }
) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: editedCategoryData.name,
        description: editedCategoryData.description,
      },
      { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators` ensures validation is applied
    );

    // Return the updated category or null if not found
    return updatedCategory;
  } catch (error) {
    // Re-throw the error to handle it in the calling function
    throw new Error(
      error instanceof Error ? error.message : "Error updating category"
    );
  }
};

export const deleteCategoryInDB = async (id: string) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    return deletedCategory;
  } catch (error) {
    // Re-throw the error to handle it in the calling function
    throw new Error(
      error instanceof Error ? error.message : "Error deleting category"
    );
  }
};

export const addSubCategoryToDB = async (newSubcategoryData: {
  name: string;
  categoryId: string;
}) => {
  try {
    // Create a new subcategory instance using correct object property access
    const newSubcategory = new Subcategory({
      name: newSubcategoryData.name,
      categoryId: newSubcategoryData.categoryId,
    });

    // Save subcategory to the database
    const savedSubcategory = await newSubcategory.save();

    // Return the saved subcategory
    return savedSubcategory;
  } catch (error) {
    // Throw the error to handle it in the calling function
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

export const listsubCategory = async()=>{
try {
  const listedSubCategories = await Subcategory.find();
  return listedSubCategories;
} catch (error: any) {
  throw new Error(error.message);
}
};


 export const editSubCategoryInDB = async( id:string,editedSubCategoryData:{ name:string,categoryId:string})=>{
  try {
    const updatedSubCategory = await Subcategory. findByIdAndUpdate(
      id,
      {
        name: editedSubCategoryData.name,
        categoryId: editedSubCategoryData.categoryId,
      },
      {new : true,runValidators : true}
    );
    return updatedSubCategory;
  } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Error updating category"
        );
      }
 }

 export const deletesubCategoryInDB = async (id: string) => {
  try {
    const deletedsubCategory = await Subcategory.findByIdAndDelete(id);
    return deletedsubCategory;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error deleting category"
    );
  }
};


export const listProperties = async () =>{
  try {
    const listedProperties = await PropertyModel.find().populate('category');
    console.log(listProperties,"kitiyo illae?");
    
    return listedProperties;
  }catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error fetching properties"
    );
  }
};


export const propertyList = async () =>{
  try {
    const listedProperties = await PropertyModel.find({is_verified : false}).populate('vendor');
    console.log(listProperties,"kitiyo illae?");
    
    return listedProperties;
  }catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error fetching properties"
    );
  }
};
