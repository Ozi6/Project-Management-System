import { useState } from "react";
import { UserPlus, Trash2, ChevronDown } from "lucide-react";
import { Menu } from "@headlessui/react";
import InvitePeople from "./InvitePeople";

const ManageMembers = () => {
    // Sample members (replace with real data)
    const [members, setMembers] = useState([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Manager" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Guest" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Member" },
    ]);

    // Available roles
    const roles = ["Manager", "Guest", "Member"];

    // Function to update role
    const updateRole = (id, newRole) => {
        setMembers(members.map(member => 
            member.id === id ? { ...member, role: newRole } : member
        ));
    };

    // Function to remove a member
    const removeMember = (id) => {
        setMembers(members.filter(member => member.id !== id));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="p-6 w-full">
            <h2 className="text-xl font-bold mb-4">Manage Members</h2>
            
            {/* Invite Button */}
            <button
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-6"
                onClick={() => setIsModalOpen(true)}
            >
                <UserPlus className="w-5 h-5 mr-2" />
                Invite People
            </button>
            <InvitePeople isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Member List */}
            <div className="space-y-4">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
                        <div>
                            <p className="text-lg font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                        </div>

                        {/* Dropdown Menu */}
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="flex items-center bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                                {member.role}
                                <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 focus:outline-none">
                                {roles.map((role) => (
                                    <Menu.Item key={role}>
                                        {({ active }) => (
                                            <button
                                                className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
                                                onClick={() => updateRole(member.id, role)}
                                            >
                                                {role}
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </Menu.Items>
                        </Menu>

                        {/* Remove Button */}
                        <button
                            onClick={() => removeMember(member.id)}
                            className="bg-red-500 text-white p-2 rounded-lg flex items-center hover:bg-red-600 transition"
                        >
                            <Trash2 className="w-5 h-5 mr-1" />
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageMembers;
