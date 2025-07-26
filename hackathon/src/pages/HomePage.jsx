import React, { useContext } from 'react';
import VendorDashboard from '../components/VendorDashboard';
import SupplierDashboard from '../components/SupplierDashboard';
import { StoreContext } from '../context/contextStore.jsx'; // Assuming this is the correct path

// Mock data to simulate a database.
// In a real app, this would come from your backend API.
const mockRequirements = [
    { id: 1, pincode: '110018', item: 'Steel Rods (TMT)', quantity: 500, unit: 'kg', price: 55, status: 'open' },
    { id: 2, pincode: '110001', item: 'Steel Rods (TMT)', quantity: 300, unit: 'kg', price: 56, status: 'open' },
    { id: 3, pincode: '110001', item: 'Cement (OPC 53)', quantity: 100, unit: 'bags', price: 450, status: 'open' },
    { id: 4, pincode: '400001', item: 'Steel Rods (TMT)', quantity: 800, unit: 'kg', price: 58, status: 'open' },
    { id: 5, pincode: '110001', item: 'Cement (OPC 53)', quantity: 150, unit: 'bags', price: 445, status: 'closed', winningBid: 430 },
];

const mockBids = [
    { id: 1, pincode: '110018', item: 'Steel Rods (TMT)', supplier: 'Shree Ram Steels', price: 52, status: 'active' },
    { id: 2, pincode: '110001', item: 'Steel Rods (TMT)', supplier: 'Gupta Iron Store', price: 53, status: 'active' },
    { id: 3, pincode: '110001', item: 'Cement (OPC 53)', supplier: 'Singhania Cements', price: 435, status: 'active' },
];


export const HomePage = () => {
    // Get user object from the global StoreContext
    const { user } = useContext(StoreContext);

    // Safely access role and pincode from the user object's metadata
    const role = user?.unsafeMetadata?.role || 'vendor'; // Default to 'vendor'
    const pincode = user?.unsafeMetadata?.pincode || 110001;

    // This function aggregates requirements by item and pincode.
    // In a real app, this logic would likely live on your backend.
    const getAggregatedDemands = (pincode) => {
        if (!pincode) return {}; // Return empty if no pincode is available

        const demands = {};
        mockRequirements
            .filter(req => req.pincode === pincode && req.status === 'open')
            .forEach(req => {
                if (!demands[req.item]) {
                    demands[req.item] = { totalQuantity: 0, unit: req.unit, vendorCount: 0, highestPrice: 0 };
                }
                demands[req.item].totalQuantity += req.quantity;
                demands[req.item].vendorCount += 1;
                if(req.price > demands[req.item].highestPrice) {
                    demands[req.item].highestPrice = req.price;
                }
            });
        
        // Attach the lowest bid to each demand
        Object.keys(demands).forEach(item => {
            const relevantBids = mockBids.filter(bid => bid.item === item && bid.pincode === pincode);
            if(relevantBids.length > 0) {
                demands[item].lowestBid = Math.min(...relevantBids.map(b => b.price));
            } else {
                demands[item].lowestBid = null;
            }
        });

        return demands;
    };

    const aggregatedDemands = getAggregatedDemands(pincode);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {role === 'vendor' ? (
                <VendorDashboard 
                    pincode={pincode} 
                    aggregatedDemands={aggregatedDemands}
                />
            ) : (
                <SupplierDashboard 
                    pincode={pincode}
                    aggregatedDemands={aggregatedDemands}
                />
            )}
        </div>
    );
};
