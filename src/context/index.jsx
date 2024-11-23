import { createContext, useContext, useState } from "react";

export const UIContext = createContext();

export const useUIContext = () => useContext(UIContext);


export const UIProvider = ({ children }) => {
  // Move the useState hook inside the component
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isUserDropDown, setIsUserDropDown] = useState(false);
  const [botId, setBotID] = useState();
  const [botName, setBotName] = useState();

  const value = {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isUserDropDown,
    setIsUserDropDown,
    botId,
    setBotID,
    botName,
    setBotName
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
