import React, { useContext } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/contextStore.jsx'; // Assuming this is the correct path

const Header = () => {
    // Get user object from the global StoreContext
    const { user } = useContext(StoreContext);
    
    // Safely access the role from the user object's metadata.
    // This assumes the 'user' object in context is the Clerk user object.
    const role = user?.unsafeMetadata?.role || '...';

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo and Site Name */}
                <div className="flex items-center space-x-4">
                   <Link to="/home" className="flex items-center space-x-2">
                       <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       <h1 className="text-2xl font-bold text-gray-800">SupplyLink</h1>
                   </Link>
                   {/* Navigation Link for Suppliers, shown conditionally based on role from context */}
                   {role === 'supplier' && (
                       <nav className="hidden md:flex">
                           <Link to="/bidding" className="text-gray-600 hover:text-blue-600 font-semibold px-3 py-2 rounded-md text-sm transition-colors">
                               Bidding Arena
                           </Link>
                       </nav>
                   )}
                </div>

                {/* User Info and Actions */}
                <div className="flex items-center space-x-4">
                   <span className="hidden sm:inline-block text-sm font-medium text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full">
                       Role: {role}
                   </span>
                   {/* This is the standard Clerk component for user profile and sign out */}
                   <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </header>
    );
};

export default Header;
