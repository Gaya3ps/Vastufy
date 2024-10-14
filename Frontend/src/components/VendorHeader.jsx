import { UserIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectVendor } from '../features/vendor/vendorSlice';

const VendorHeader = () => {
  // Fetch vendor data from the Redux store
  const vendor = useSelector(selectVendor);

  return (
    <div className="flex items-center space-x-2 p-4 bg-gray-100">
      <UserIcon className="w-8 h-8 text-gray-600" />
      <span className="text-lg font-semibold text-gray-700">{vendor?.name || 'Vendor'}</span>
    </div>
  );
};

export default VendorHeader;
