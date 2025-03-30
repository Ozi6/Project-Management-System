import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onSearch }) =>
{
    const {t} = useTranslation();
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
            <div className="flex items-center rounded-lg bg-[var(--loginpage-bg2)] relative">
                <input
                    type="text"
                    placeholder={t("prode.search")}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 pr-10 text-sm text-[var(--features-text-color)] rounded-lg border-2 border-[var(--gray-card3)] focus:outline-none focus:ring-2 focus:ring-[var(--features-icon-color)] focus:border-[var(--features-icon-color)]/50"/>
                <button
                    type="submit"
                    className="absolute right-2 text-[var(--text-color)] hover:text-[var(--features-icon-color)] transition-colors">
                    <Search size={18}/>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;