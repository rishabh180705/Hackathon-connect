import React, { useState } from 'react';
import { PlusCircle, ShoppingCart, Tag, TrendingDown } from 'lucide-react';

const RequirementForm = ({ pincode }) => {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would be an API call to your backend
        alert(`New Requirement Submitted:\nItem: ${item}\nQuantity: ${quantity}\nExpected Price: ${price}\nPincode: ${pincode}`);
        // Reset form
        setItem('');
        setQuantity('');
        setPrice('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <PlusCircle className="mr-2 text-blue-600" /> Post a New Requirement
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                    <label htmlFor="item" className="block text-sm font-medium text-gray-700">Item Name</label>
                    <input type="text" id="item" value={item} onChange={e => setItem(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Expected Price</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="md:col-span-4">
                     <button type="submit" className="w-full md:w-auto mt-2 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">Submit Requirement</button>
                </div>
            </form>
        </div>
    );
};

const VendorDashboard = ({ pincode, aggregatedDemands }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h2>
            <RequirementForm pincode={pincode} />
            
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <ShoppingCart className="mr-2 text-green-600" /> Live Market View (Pincode: {pincode})
                </h3>
                <div className="space-y-4">
                    {Object.keys(aggregatedDemands).length > 0 ? Object.entries(aggregatedDemands).map(([item, data]) => (
                        <div key={item} className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h4 className="font-bold text-gray-800">{item}</h4>
                                <p className="text-sm text-gray-600">
                                    Total Demand: <span className="font-semibold">{data.totalQuantity} {data.unit}</span> from <span className="font-semibold">{data.vendorCount} vendors</span>
                                </p>
                            </div>
                            <div className="mt-2 md:mt-0 text-left md:text-right">
                                {data.lowestBid ? (
                                    <>
                                        <p className="text-sm text-gray-500 flex items-center justify-end"><TrendingDown className="mr-1 text-green-500" /> Current Lowest Bid</p>
                                        <p className="text-2xl font-bold text-green-600">₹{data.lowestBid}</p>
                                    </>
                                ) : (
                                    <p className="text-sm font-semibold text-gray-500">No bids yet</p>
                                )}
                            </div>
                        </div>
                    )) : <p className="text-gray-500">No active demands in your area currently.</p>}
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
