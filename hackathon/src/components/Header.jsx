import React from 'react';
// import { useUser, UserButton } from '@clerk/clerk-react';

const Header = () => {
    // The useUser hook provides user information.
    // const { user } = useUser();
    // Safely access the role from metadata.
    // const role = user?.unsafeMetadata?.role || '...';
const role = 'vendor';
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo and Site Name */}
                <div className="flex items-center space-x-2">
                   <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   <h1 className="text-2xl font-bold text-gray-800">SupplyLink</h1>
                </div>

                {/* User Info and Actions */}
                <div className="flex items-center space-x-4">
                   <span className="hidden sm:inline-block text-sm font-medium text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full">
                       Role: {role}
                   </span>
                   {/* <UserButton afterSignOutUrl="/" /> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
