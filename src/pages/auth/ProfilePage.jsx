import React from 'react';
import { UserProfile, SignOutButton } from "@clerk/clerk-react";
import Header from '../../components/Header';

export default function ProfilePage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="Profile" />
            
            <div className="flex flex-col flex-grow items-center justify-center py-8">
                <div className="w-fit">
                    <div className="w-full bg-[#C4D1FB] p-6 rounded-lg shadow-md">
                        <UserProfile />

                        <div className="mt-6 flex justify-center">
                        
                            <SignOutButton>
                                <button className="bg-[#0E46A3] text-white px-6 py-3 rounded-lg hover:bg-[#1E0342] transition-colors duration-200 text-lg font-semibold">
                                    Log Out
                                </button>
                            </SignOutButton>
                        </div>


                    </div>
                    
                    
                </div>
            </div>
        </div>
    );
}
