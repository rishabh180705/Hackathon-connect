import React, { useState, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Tag, Users, BarChart, Handshake, TrendingDown } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

// --- Mock Data ---
// In a real application, this data would be fetched from your backend API.
const mockAllRequirements = [
    { id: 1, state: 'Delhi', item: 'Steel Rods (TMT)', quantity: 800, unit: 'kg', vendorCount: 2 },
    { id: 2, state: 'Delhi', item: 'Cement (OPC 53)', quantity: 250, unit: 'bags', vendorCount: 3 },
    { id: 3, state: 'Maharashtra', item: 'Steel Rods (TMT)', quantity: 1200, unit: 'kg', vendorCount: 5 },
    { id: 4, state: 'Delhi', item: 'Bricks (Class A)', quantity: 5000, unit: 'pieces', vendorCount: 4 },
    { id: 5, state: 'Karnataka', item: 'Plywood (18mm)', quantity: 100, unit: 'sheets', vendorCount: 2 },
    { id: 6, state: 'Maharashtra', item: 'PVC Pipes (4 inch)', quantity: 300, unit: 'meters', vendorCount: 3 },
];

const mockAllBids = [
    { id: 1, reqId: 1, supplier: 'Delhi Steels', price: 52 },
    { id: 2, reqId: 1, supplier: 'Gupta Iron', price: 53 },
    { id: 3, reqId: 2, supplier: 'Singhania Cements', price: 435 },
    { id: 4, reqId: 3, supplier: 'Mumbai Metals', price: 59 },
];
// --- End Mock Data ---

const BiddingPage = () => {
    const { isLoaded, user } = useUser();
    const [bids, setBids] = useState(mockAllBids);
    const [activeBidItemId, setActiveBidItemId] = useState(null);
    const [bidPrice, setBidPrice] = useState('');

    // Memoize the calculation of demands for the user's state
    const demandsForState = useMemo(() => {
        if (!isLoaded || !user) return [];
        
        const userState = user.unsafeMetadata?.state;
        if (!userState) return [];

        return mockAllRequirements
            .filter(req => req.state === userState)
            .map(req => {
                const relevantBids = bids.filter(b => b.reqId === req.id);
                const lowestBid = relevantBids.length > 0 ? Math.min(...relevantBids.map(b => b.price)) : null;
                return { ...req, lowestBid };
            });
    }, [isLoaded, user, bids]);

    const handlePlaceBidClick = (req) => {
        setActiveBidItemId(req.id);
        // Suggest a price slightly lower than the current best
        setBidPrice(req.lowestBid ? String(req.lowestBid - 1) : '');
    };

    const handleBidSubmit = (e, reqId) => {
        e.preventDefault();
        // In a real app, this would be an API call to your backend
        const newBid = {
            id: bids.length + 1,
            reqId,
            supplier: 'Your Company', // This would come from the user's profile
            price: Number(bidPrice)
        };
        setBids([...bids, newBid]);
        alert(`Bid Placed!\nItem ID: ${reqId}\nPrice: ${bidPrice}`);
        setActiveBidItemId(null);
        setBidPrice('');
    };

    if (!isLoaded) {
        return <div className="flex justify-center items-center p-10"><LoadingSpinner /></div>;
    }
    
    const userState = user?.unsafeMetadata?.state;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Live Bidding Arena</h1>
                <p className="text-lg text-gray-600 mt-1">
                    Aggregated demands from vendors in <span className="font-semibold text-purple-700">{userState || 'your state'}</span>.
                </p>
            </div>

            <div className="space-y-6">
                {demandsForState.length > 0 ? demandsForState.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            {/* Item Details */}
                            <div className="flex-1">
                                <h2 className="font-bold text-gray-800 text-xl">{req.item}</h2>
                                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                                    <span className="flex items-center"><BarChart className="w-4 h-4 mr-1.5 text-gray-400"/>Total Demand: <b className="ml-1">{req.quantity} {req.unit}</b></span>
                                    <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-gray-400"/>From <b className="ml-1">{req.vendorCount} Vendors</b></span>
                                </div>
                            </div>

                            {/* Bidding Section */}
                            <div className="w-full md:w-auto mt-4 md:mt-0 md:text-right">
                                <p className="text-sm text-gray-500 flex items-center md:justify-end"><TrendingDown className="mr-1 text-green-500" /> Current Lowest Bid</p>
                                <p className="text-3xl font-bold text-green-600">{req.lowestBid ? `₹${req.lowestBid}` : 'No Bids Yet'}</p>
                                <button onClick={() => handlePlaceBidClick(req)} className="mt-2 bg-purple-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-purple-700 transition text-sm">
                                    {activeBidItemId === req.id ? 'Update Bid' : 'Place a Bid'}
                                </button>
                            </div>
                        </div>

                        {/* Bidding Form */}
                        {activeBidItemId === req.id && (
                            <form onSubmit={(e) => handleBidSubmit(e, req.id)} className="mt-4 pt-4 border-t border-gray-200">
                                <h3 className="font-semibold mb-2 text-gray-700">Your Offer for {req.item}</h3>
                                <div className="flex flex-wrap items-end gap-4">
                                    <div>
                                        <label htmlFor="bidPrice" className="block text-sm font-medium text-gray-700">Your Offer Price (per {req.unit})</label>
                                        <input type="number" id="bidPrice" value={bidPrice} onChange={e => setBidPrice(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" required step="0.01" />
                                    </div>
                                    <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center"><Handshake className="w-4 h-4 mr-2"/>Submit Bid</button>
                                    <button type="button" onClick={() => setActiveBidItemId(null)} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700">No Active Demands</h3>
                        <p className="text-gray-500 mt-2">There are currently no aggregated demands from vendors in your state.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BiddingPage;
