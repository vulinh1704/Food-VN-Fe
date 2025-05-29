import React, { createContext, useContext, useState } from 'react';
const ProfileMenuContext = createContext({});
export const PROFILE_MENU = {
  INFO: "INFO",
  ADDRESS: "ADDRESS",
  INVOICES: "INVOICES",
  CHANGE_PASSWORD: "CHANGE_PASSWORD"
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
