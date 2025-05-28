import React from 'react';

export const DateRangePicker = ({ onFromDateChange, onToDateChange, fromDate, toDate }) => {
    return (
        <div className="flex flex-col">
            <h4 className="font-medium mb-2">Date Range</h4>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="datetime-local"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#fecb02] focus:border-[#fecb02] block w-full pl-10 p-2.5"
                        placeholder="From date"
                        value={fromDate || ''}
                        onChange={(e) => onFromDateChange(e.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-[2px] bg-gray-300"></div>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="datetime-local"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#fecb02] focus:border-[#fecb02] block w-full pl-10 p-2.5"
                        placeholder="To date"
                        value={toDate || ''}
                        onChange={(e) => onToDateChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}; 