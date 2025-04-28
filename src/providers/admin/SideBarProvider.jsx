import React, { createContext, useContext, useState } from 'react';
const SideBarContext = createContext({});

export const SideBarProvider = ({ children }) => {
    const [active, setActive] = useState(1);

    const value = {
        active,
        setActive,
    };

    return (
        <SideBarContext.Provider value={value}>
            {children}
        </SideBarContext.Provider>
    );
};

export const useSideBar = () => {
    return useContext(SideBarContext);
};
