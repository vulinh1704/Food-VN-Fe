import React, { createContext, useContext, useState } from 'react';

const AdminOrderContext = createContext({});

export const AdminOrderProvider = ({ children }) => {
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const selectOrder = (orderId) => {
        setSelectedOrderId(orderId);
    };

    return (
        <AdminOrderContext.Provider value={{ selectedOrderId, selectOrder }}>
            {children}
        </AdminOrderContext.Provider>
    );
};

export const useAdminOrder = () => {
    const context = useContext(AdminOrderContext);
    if (!context) {
        throw new Error('useAdminOrder must be used within an AdminOrderProvider');
    }
    return context;
}; 