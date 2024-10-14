import { NextFunction, Request, response, Response } from "express";
import adminInteractor from "../../domain/usecases/auth/adminInteractor";
import { getAllVendors } from "../../infrastructure/repositories/mongoVendorrepository";
import { log } from "console";
import { LicenseModel } from "../../infrastructure/database/dbModel/licenceModel";
import { Vendor } from "../../infrastructure/database/dbModel/vendorModel";

export default {
  adminLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log("yyyyyyyyy", req.body);
      const { email, password } = req.body;
      if (!email && !password) {
        throw new Error("user credentials not there");
      }
      const credentials = {
        email,
        password,
      };
      // console.log(credentials);

      const response = await adminInteractor.loginAdmin(credentials);
      // console.log("fffffffffffffff", response);
      res.status(200).json({ message: "Login success", response });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
      next(error);
    }
  },

  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const users = await adminInteractor.getUsers(Number(page), Number(limit));
      res.status(200).json(users);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },

  blockUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { is_blocked } = req.body;
      // console.log("Request Params:", req.params);
      // console.log("Request Body:", req.body);

      const updatedUser = await adminInteractor.updatedUserStatus(
        userId,
        is_blocked
      );
      res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },

  getVendors: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const vendors = await adminInteractor.getVendors(
        Number(page),
        Number(limit)
      );
      res.status(200).json(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  },

  getVendorById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor = await adminInteractor.fetchVendorById(req.params.id);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
      res.status(200).json(vendor);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
      next(error);
    }
  },

  getVerifiedVendors: async (req: Request, res: Response) => {
    try {
      const response = await getAllVendors();
      log(response);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json(error);
    }
  },
  blockVendor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { vendorId } = req.params;
      const { is_blocked } = req.body;
      const updatedVendor = await adminInteractor.updatedVendorStatus(
        vendorId,
        is_blocked
      );
      log("protectaDMIN CALLED");
      log(updatedVendor, "upppppp");
      res.status(200).json(updatedVendor);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },

  getLicenseByVendorEmail: async (req: Request, res: Response) => {
    const { email } = req.params;

    try {
      const license = await LicenseModel.findOne({ email }).exec();
      if (!license) {
        return res.status(404).json({ message: "License not found" });
      }

      res.status(200).json(license);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching license", error: error.message });
    }
  },

  updateVendorVerificationStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { is_verified } = req.body;
      const vendor = await adminInteractor.verifyVendor(
        req.params.id,
        is_verified
      );
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
      res.status(200).json(vendor);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
      next(error);
    }
  },

  updateIsVerified: async (req: Request, res: Response) => {
    const vendorId = req.params.vendorId;
    const { is_verified } = req.body;

    try {
      const updatedVendor = await Vendor.findByIdAndUpdate(
        vendorId,
        { is_verified },
        { new: true }
      );
      res.json(updatedVendor);
    } catch (err) {
      console.error("Error updating vendor is_verified:", err);
      res.status(500).json({ error: "Failed to update vendor is_verified" });
    }
  },

  addCategory: async (req: Request, res: Response) => {
    try {
      // console.log(req.body, "jjjjjjjjjjjjjjjjjjjjj");
      const { name, description } = req.body;
      if (!name)
        return res.status(404).json({ message: "Category name  not found" });
      const newCategoryData = { name, description };

      const addCategoryData = await adminInteractor.addCategory(
        newCategoryData
      );
      return res
        .status(201)
        .json({ message: "Category added successfully", addCategoryData });
    } catch (error) {
      console.error("Error adding category", error);
      res.status(500).json({ error: "Failed to add category" });
    }
  },

  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await adminInteractor.getCategories();
      return res
        .status(200)
        .json({ message: "Fetched categories successfully", categories });
    } catch (error) {
      console.error("Error getting category", error);
      res.status(500).json({ error: "Failed to get category" });
    }
  },

  editCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      // console.log(req.body, "llllllllllllllllllllllllll");
      // console.log(id, "ooooooooooooooo");
      if (!name || !id)
        return res
          .status(404)
          .json({ message: "Category name and id not found" });

      const categoryEdit = await adminInteractor.editedCategory(id, {
        name,
        description,
      });
      return res.status(200).json(categoryEdit);
    } catch (error) {
      console.error("Error editing category", error);
      res.status(500).json({ error: "Failed to edit category" });
    }
  },

  deleteCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // console.log(id, "888888888888");
      if (!id)
        return res.status(404).json({ message: "Category id not found" });

      const categoryDelete = await adminInteractor.deletedCategory(id);
      return res.status(200).json(categoryDelete);
    } catch (error) {
      console.error("Error deleting category", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  },

  addSubCategory: async (req: Request, res: Response) => {
    try {
      // console.log(req.body, "///////////////////////////////");
      const { name, categoryId } = req.body;
      if (!name || !categoryId)
        return res
          .status(404)
          .json({ message: "Subcategory name and id not found" });

      const newSubcategory = { name, categoryId };

      const addSubcategoryData = await adminInteractor.addSubcategory(
        newSubcategory
      );
      return res.status(200).json(addSubcategoryData);
    } catch (error) {}
  },

  getSubCategories: async (req: Request, res: Response) => {
    try {
      const subCategories = await adminInteractor.getSubCategories();
      return res
        .status(200)
        .json({ message: "Fetched subcategories successfully", subCategories });
    } catch (error) {
      console.error("Error getting subcategory", error);
      res.status(500).json({ error: "Failed to get subcategory" });
    }
  },

  editSubCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, categoryId } = req.body;
      // console.log(req.body, "77777777777777");
      // console.log(id, "77777777777777444444444444444");
      if (!id || !name || !categoryId)
        return res
          .status(404)
          .json({ message: "CategoryId ,name and id not found" });

      const editSubCategories = await adminInteractor.editSubCategory(id, {
        name,
        categoryId,
      });
      return res.status(200).json(editSubCategories);
    } catch (error) {
      console.error("Error editing category", error);
      res.status(500).json({ error: "Failed to edit category" });
    }
  },

  deleteSubCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(404).json({ message: "Subcategory id not found" });
      const subCategoryDelete = await adminInteractor.deletedSubCategory(id);
      return res.status(200).json(subCategoryDelete);
    } catch (error) {
      console.error("Error deleting category", error);
      res.status(500).json({ error: "Failed to delete subcategory" });
    }
  },

  getProperties: async (_req: Request, res: Response) => {  
    console.log("evuddsdsssssss");

    try {
      const propertyList = await adminInteractor.getPropertyList();

      return res.status(200).json(propertyList);
    } catch (error) {
      console.error("Error fetching  properties", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  },

  verifyProperty:  async (req: Request, res: Response): Promise<void> => {
    try {
      const verifyProperties = await adminInteractor.verifyProperties();
      
       res.status(200).json(verifyProperties);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  },

  propertyDetailVerification: async (req: Request, res: Response) => {
    console.log("reached property detail verification"); // Debugging log
  
    try {
      const { propertyId } = req.params; // Extract propertyId from params
      console.log(propertyId, "Request params received");
  
      // // Fetch the property details by propertyId from the database
      // const property = await PropertyModel.findById(propertyId)
      //   .populate('vendor') // Assuming you want to populate the vendor details
      //   .populate('category'); // Assuming you want to populate the category details
  
      // if (!property) {
      //   return res.status(404).json({ message: 'Property not found' });
      // }
  
      // // Send the property details as the response
      // return res.status(200).json(property);
    } catch (error) {
      console.error("Error fetching property details:", error);
      res.status(500).json({ error: 'Failed to fetch property details' });
    }
  }


};


