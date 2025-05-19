import React, { createContext, useContext, useState } from 'react';
const ProfileMenuContext = createContext({});
export const PROFILE_MENU = {
  INFO: 1,
  ADDRESS: 2,
  INVOICES: 3
}

export const ProfileMenuProvider = ({ children }) => {
  const [option, setOption] = useState();

  const value = {
    option,
    setOption
  };

  return (
    <ProfileMenuContext.Provider value={value}>
      {children}
    </ProfileMenuContext.Provider>
  );
};

export const useProfileMenu = () => {
  return useContext(ProfileMenuContext);
};
