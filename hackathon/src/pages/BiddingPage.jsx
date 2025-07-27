import React, { useState, useMemo, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react'; // Import useAuth to get userId
import { useNavigate } from 'react-router-dom';
import { Users, BarChart, Handshake, TrendingDown, ShieldAlert } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchRequirementsByState, postBid } from '../utils/api'; // Import the new API functions

const BiddingPage = () => {
    const { isLoaded, user } = useUser();
    const { userId } = useAuth(); // Get the current user's Clerk ID
    const navigate = useNavigate();
    
    // State to hold data fetched from the backend
    const [requirements, setRequirements] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);
    
    // Local state for bidding UI
    const [activeBidItemId, setActiveBidItemId] = useState(null);
    const [bidPrice, setBidPrice] = useState('');

    const role = user?.unsafeMetadata?.role;
    const userState = user?.unsafeMetadata?.state;

    // useEffect hook to fetch requirements data
    useEffect(() => {
        if (isLoaded && userState) {
            const loadRequirements = async () => {
                setIsLoadingData(true);
                try {
                    const response = await fetchRequirementsByState(userState);
                    setRequirements(response.data || []);
                } catch (err) {
                    console.error("Failed to fetch requirements:", err);
                    setError("Could not load requirements data.");
                } finally {
                    setIsLoadingData(false);
                }
            };
            loadRequirements();
        }
    }, [isLoaded, userState]);

    // This effect redirects vendors.
    useEffect(() => {
        if (isLoaded && role === 'vendor') {
            setTimeout(() => { navigate('/home'); }, 3000);
        }
    }, [isLoaded, role, navigate]);

    const handlePlaceBidClick = (req) => {
        setActiveBidItemId(req._id);
        const lowestBid = req.bids && req.bids.length > 0 ? Math.min(...req.bids.map(b => b.price)) : null;
        setBidPrice(lowestBid ? String(lowestBid - 1) : '');
    };

    // --- Updated handleBidSubmit function ---
    const handleBidSubmit = async (e, requirementId) => {
        e.preventDefault();
        if (!userId) {
            alert("You must be signed in to place a bid.");
            return;
        }

        try {
            const bidData = {
                requirementId,
                clerkUserId: userId,
                supplierName: user?.fullName || 'Anonymous Supplier',
                price: Number(bidPrice)
            };
            
            const response = await postBid(bidData);
            const newBid = response.data;

            // Optimistically update the UI with the new bid
            setRequirements(prevRequirements => 
                prevRequirements.map(req => {
                    if (req._id === requirementId) {
                        return { ...req, bids: [...(req.bids || []), newBid] };
                    }
                    return req;
                })
            );

            alert(`Bid Placed Successfully!`);
            setActiveBidItemId(null);
            setBidPrice('');
        } catch (err) {
            console.error("Failed to submit bid:", err);
            alert("Error: Could not place your bid. Please try again.");
        }
    };

    // --- RENDER LOGIC ---
    if (!isLoaded || isLoadingData) {
        return <div className="flex justify-center items-center p-10"><LoadingSpinner /></div>;
    }
    if (error) {
        return <div className="text-center text-red-500 p-10">{error}</div>
    }
    if (role === 'vendor') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-10 px-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
                    <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-4 text-xl font-semibold text-red-800">Access Denied</h3>
                    <p className="text-red-600 mt-2">This page is only for suppliers. Redirecting...</p>
                </div>
            </div>
        );
    }
    if (role === 'supplier') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Live Bidding Arena</h1>
                    <p className="text-lg text-gray-600 mt-1">
                        Open requirements for vendors in <span className="font-semibold text-purple-700">{userState || 'your state'}</span>.
                    </p>
                </div>
                <div className="space-y-6">
                    {requirements.length > 0 ? requirements.map(req => {
                        const lowestBid = req.bids && req.bids.length > 0 ? Math.min(...req.bids.map(b => b.price)) : null;
                        return (
                        <div key={req._id} className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="flex-1">
                                    <h2 className="font-bold text-gray-800 text-xl">{req.item}</h2>
                                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                                        <span className="flex items-center"><BarChart className="w-4 h-4 mr-1.5 text-gray-400"/>Required: <b className="ml-1">{req.quantity} {req.unit}</b></span>
                                        <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-gray-400"/>Pincode: <b className="ml-1">{req.pincode}</b></span>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto mt-4 md:mt-0 md:text-right">
                                    <p className="text-sm text-gray-500 flex items-center md:justify-end"><TrendingDown className="mr-1 text-green-500" /> Lowest Bid</p>
                                    <p className="text-3xl font-bold text-green-600">{lowestBid ? `₹${lowestBid}` : 'No Bids Yet'}</p>
                                    <button onClick={() => handlePlaceBidClick(req)} className="mt-2 bg-purple-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-purple-700 transition text-sm">
                                        {activeBidItemId === req._id ? 'Update Bid' : 'Place a Bid'}
                                    </button>
                                </div>
                            </div>
                            {activeBidItemId === req._id && (
                                <form onSubmit={(e) => handleBidSubmit(e, req._id)} className="mt-4 pt-4 border-t border-gray-200">
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
                    )}) : (
                        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-700">No Active Requirements</h3>
                            <p className="text-gray-500 mt-2">There are no open requirements from vendors in your state.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-10 px-6 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">Authorizing...</h3>
                <p className="text-gray-500 mt-2">Please wait while we verify your role.</p>
            </div>
        </div>
    );
};

export default BiddingPage;
