import React, { createContext, useContext, useState } from 'react';
const NavaBarContext = createContext({});

export const NavBarProvider = ({ children }) => {
  const [active, setActive] = useState(1);

  const value = {
    active,
    setActive,
  };

  return (
    <NavaBarContext.Provider value={value}>
      {children}
    </NavaBarContext.Provider>
  );
};

export const useNavabar = () => {
  return useContext(NavaBarContext);
};
