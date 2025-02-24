import { UserProfile, SignOutButton } from "@clerk/clerk-react";

export default function ProfilePage() {
    return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
            {/* User Profile */}
            <UserProfile />

            {/* Log Out Button */}
            <SignOutButton>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 text-lg font-semibold">
                    Log Out
                </button>
            </SignOutButton>
        </div>
    );
}
