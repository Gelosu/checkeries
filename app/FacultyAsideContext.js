import { createContext, useContext, useState } from "react";

const FacultyAsideContext = createContext();

export function FacultyAsideProvider({ children }) {
  const [TUPCID, setTUPCID] = useState("");
  const [accountType, setAccountType] = useState("");

  return (
    <FacultyAsideContext.Provider value={{ TUPCID, accountType, setTUPCID, setAccountType }}>
      {children}
    </FacultyAsideContext.Provider>
  );
}

export function useFacultyAside() {
  return useContext(FacultyAsideContext);
}
