import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) =>
{
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredColumns, setFilteredColumns] = useState(null);

    const performSearch = (term) =>
    {
        setSearchTerm(term);
    };

    const filterColumns = (columns, term) =>
    {
        if(!term.trim())
        {
            setFilteredColumns(null);
            return null;
        }

        const searchLowerCase = term.toLowerCase();

        const processedColumns = columns.map(column =>
        {
            return column.filter(category =>
            {
                if(category.title.toLowerCase().includes(searchLowerCase))
                {
                    return true;
                }

                const hasMatchingTaskList = category.taskLists.some(list =>
                    list.title.toLowerCase().includes(searchLowerCase)
                );

                if(hasMatchingTaskList)
                {
                    return true;
                }


                const hasMatchingEntry = category.taskLists.some(list =>
                    list.entries.some(entry =>
                        entry.toLowerCase().includes(searchLowerCase)
                    )
                );

                return hasMatchingEntry;
            });
        }).filter(column => column.length > 0);

        setFilteredColumns(processedColumns);
        return processedColumns;
    };

    const value =
    {
        searchTerm,
        filteredColumns,
        performSearch,
        filterColumns
    };

    return(
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};