import { Navigate, Outlet } from "react-router";
import Cookies from "js-cookie";

const VendorPrivateRoutes = () => {
    const token = Cookies.get('tokenvendor')
    console.log(token);
    return(
        token ? <Outlet /> : <Navigate to={'/vendor/login'}/>
    )
}

export default VendorPrivateRoutes