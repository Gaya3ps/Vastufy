export interface IVendor{
    name: string;
    email: string;
    password: string;
    mobileNumber : number;
    //review here
    is_verified: boolean;
    is_blocked: boolean;
    otp_verified:boolean
  }

  
export interface PaginatedVendors {
  vendors: IVendor[];
  totalPages: number;
}



export interface UpdateVendorData {
  name?: string;
}