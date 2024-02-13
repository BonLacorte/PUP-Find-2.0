import React from 'react';

const AdminYearSelector = ({ selectedYear, onYearChange }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, index) => 2000 + index);

    return (
        <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-gray-100 border-2 px-2 py-1 rounded-lg"
        >
            {years.map((year) => (
                <option key={year} value={year}>
                    {year}
                </option>
            ))}
        </select>
    );
};

export default AdminYearSelector;
