import { Route, Routes,Navigate } from 'react-router'
import VendorSignup from '../../pages/vendor/VendorSignup'
import VendorOtp from '../../pages/vendor/VendorOtp'
import Login from '../../pages/vendor/Login'
import License from '../../pages/vendor/License'
import SuccessPage from '../../components/SuccessPage'
import VendorHome from '../../pages/vendor/VendorHome'
import VendorProfile from '../../pages/vendor/VendorProfile'
import AddProperty from '../../pages/vendor/AddProperty'
import PropertyList from '../../pages/vendor/PropertyList'



const VendorRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/signup' element={<VendorSignup />} />
                <Route path='/otp-verification' element={<VendorOtp />} />
                <Route path='/login' element={<Login />} />
                <Route path='/uploadlicense' element={<License />} />
                <Route path='/success' element={<SuccessPage />} />
                <Route path='/home' element={<VendorHome />} />
                <Route path='/profile' element={<VendorProfile />} />
                <Route path='/add-property' element={<AddProperty />} /> 
                <Route path='/propertylist' element={<PropertyList />} /> 


                
            </Routes>
        </>
    )
}

export default VendorRoutes
