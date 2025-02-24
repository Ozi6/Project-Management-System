import { useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ManageAccess = () => {
    const accessOptions = [
        "Edit Tasks",
        "Edit Lists",
        "Invite People",
        "Delete People",
        "Edit Teams",
        "Edit Access",
    ];
    const [members, setMembers] = useState([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Manager" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Guest" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Member" },
    ]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [permissions, setPermissions] = useState({});

    const togglePermission = (person, option) => {
        setPermissions(prev => ({
            ...prev,
            [person]: {
                ...prev[person],
                [option]: !prev[person]?.[option]
            }
        }));
    };

    return (
        <div className="p-6 relative">
            <h2 className="text-xl font-bold mb-4">Manage Access</h2>
            <div className={`space-y-4 ${selectedPerson ? 'blur-sm' : ''}`}>
                {members.map((member) => (
                    <div 
                        key={member.id} 
                        className="flex items-center justify-between p-4 bg-white shadow rounded-lg cursor-pointer"
                        onClick={() => setSelectedPerson(member.name)}
                    >
                        <div>
                            <p className="text-lg font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPerson && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-10">
                        <h3 className="text-lg font-bold mb-4">{selectedPerson}'s Access</h3>
                        <ul>
                            {accessOptions.map(option => (
                                <li key={option} className="flex justify-between items-center py-2 border-b">
                                    <span>{option}</span>
                                    <div
                                        className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${permissions[selectedPerson]?.[option] ? 'bg-green-500' : 'bg-red-500'}`}
                                        onClick={() => togglePermission(selectedPerson, option)}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform duration-300 ${permissions[selectedPerson]?.[option] ? 'translate-x-7' : 'translate-x-0'}`}>
                                            {permissions[selectedPerson]?.[option] ? <CheckIcon className="w-4 h-4 text-green-500" /> : <XMarkIcon className="w-4 h-4 text-red-500" />}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={() => setSelectedPerson(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAccess;
