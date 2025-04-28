import React, { createContext, useContext, useState } from 'react';
const NavBarContext = createContext({});

export const NavBarProvider = ({ children }) => {
  const [active, setActive] = useState(1);

  const value = {
    active,
    setActive,
  };

  return (
    <NavBarContext.Provider value={value}>
      {children}
    </NavBarContext.Provider>
  );
};

export const useNavbar = () => {
  return useContext(NavBarContext);
};
