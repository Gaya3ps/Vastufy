import Cookies from "js-cookie";

export const isAuthenticated = () => {
    const token = Cookies.get('token');
    console.log("token",token);
    return !!token;
}


export const isVendorAuthenticated = () => {
    const token = Cookies.get('tokenvendor');
    console.log("tokenvendo",token);
    return !!token;
}