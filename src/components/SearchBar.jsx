import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) =>
{
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) =>
    {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return(
        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
            <div className="flex items-center relative">
                <input
                    type="text"
                    placeholder="Search categories, tasks, entries..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 pr-10 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                <button
                    type="submit"
                    className="absolute right-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <Search size={18}/>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;