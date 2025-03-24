import React from 'react';
import { UserProfile, SignOutButton } from "@clerk/clerk-react";
import Header from '../../components/Header';

export default function ProfilePage() {
    return (
        <div className="flex flex-col text-[var(--features-icon-color)] min-h-screen bg-[var(--loginpage-bg2)]">
            <Header title="Profile" />
            
            <div className="flex flex-col flex-grow items-center justify-center py-8">
                <div className="w-fit">
                    <div className="w-full bg-[var(--loginpage-bg)] p-6 rounded-lg shadow-md">
                        <UserProfile />

                        <div className="mt-6 flex justify-center">
                        
                            <SignOutButton>
                                <button className="text-white bg-[var(--features-icon-color)] px-6 py-3 rounded-lg hover:bg-[var(--hover-color)] transition-colors duration-200 text-lg font-semibold">
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
