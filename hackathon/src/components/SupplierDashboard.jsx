import React, { useState } from 'react';
import { BarChart, Tag, Users, Handshake } from 'lucide-react';

const SupplierDashboard = ({ pincode, aggregatedDemands }) => {
    const [bidItem, setBidItem] = useState(null);
    const [bidPrice, setBidPrice] = useState('');

    const handlePlaceBidClick = (item, currentLowestBid) => {
        setBidItem(item);
        setBidPrice(currentLowestBid ? String(currentLowestBid - 1) : '');
    };
    
    const handleBidSubmit = (e) => {
        e.preventDefault();
        // API call to submit the bid
        alert(`Bid Placed!\nItem: ${bidItem}\nPrice: ${bidPrice}`);
        setBidItem(null);
        setBidPrice('');
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h2>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <BarChart className="mr-2 text-purple-600" /> Aggregated Demand (Pincode: {pincode})
                </h3>
                <div className="space-y-4">
                    {Object.keys(aggregatedDemands).length > 0 ? Object.entries(aggregatedDemands).map(([item, data]) => (
                        <div key={item} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-xl">{item}</h4>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                        <span className="flex items-center"><Tag className="w-4 h-4 mr-1"/> Total Demand: <b className="ml-1">{data.totalQuantity} {data.unit}</b></span>
                                        <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> Vendors: <b className="ml-1">{data.vendorCount}</b></span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Highest vendor expectation: ₹{data.highestPrice}/{data.unit}</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-left md:text-right">
                                    <p className="text-sm text-gray-500">Current Lowest Bid</p>
                                    <p className="text-2xl font-bold text-green-600">{data.lowestBid ? `₹${data.lowestBid}` : 'N/A'}</p>
                                    <button onClick={() => handlePlaceBidClick(item, data.lowestBid)} className="mt-2 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition text-sm">
                                        Place a Bid
                                    </button>
                                </div>
                            </div>
                            {bidItem === item && (
                                <form onSubmit={handleBidSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h5 className="font-semibold mb-2">Your Bid for {item}</h5>
                                    <div className="flex items-end gap-4">
                                        <div>
                                            <label htmlFor="bidPrice" className="block text-sm font-medium text-gray-700">Your Offer Price (per {data.unit})</label>
                                            <input type="number" id="bidPrice" value={bidPrice} onChange={e => setBidPrice(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                        </div>
                                        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center"><Handshake className="w-4 h-4 mr-2"/>Submit Bid</button>
                                        <button type="button" onClick={() => setBidItem(null)} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )) : <p className="text-gray-500">No active demands to bid on in your area.</p>}
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboard;
