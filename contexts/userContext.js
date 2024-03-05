import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');

  const updateUserName = (newName) => {
    setUserName(newName);
  };

  return (
    <UserContext.Provider value={{ userName, updateUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
