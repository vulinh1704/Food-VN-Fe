import React, { createContext, useContext, useState } from 'react';
const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authPopup, setAuthPopup] = useState(false);
    const [orderPopup, setOrderPopup] = useState(false);

    const value = {
        user,
        setUser,
        authPopup,
        setAuthPopup,
        orderPopup,
        setOrderPopup
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
