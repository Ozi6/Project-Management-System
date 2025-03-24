import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ResourcesDropdown = ({ isOpen, onClick }) => {
    const{t} = useTranslation();
    return (
        <button
            onClick={onClick}
            className="flex items-center text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
            {t("header2")}
            <ChevronDown 
                className={`ml-1 h-5 w-5 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                }`}
            />
        </button>
    );
};

export default ResourcesDropdown;