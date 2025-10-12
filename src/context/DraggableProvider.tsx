import React, { createContext, useState } from "react";

export const DraggableContext = createContext();

export const DraggableProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <DraggableContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </DraggableContext.Provider>
  );
};
