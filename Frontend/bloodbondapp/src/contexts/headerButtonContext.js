// contexts/HeaderButtonsContext.js
import React, { createContext, useState } from 'react';

const HeaderButtonsContext = createContext();

export const HeaderButtonsProvider = ({ children }) => {
  const [headerButtons, setHeaderButtons] = useState([]);

  return (
    <HeaderButtonsContext.Provider value={{ headerButtons, setHeaderButtons }}>
      {children}
    </HeaderButtonsContext.Provider>
  );
};

export default HeaderButtonsContext;
