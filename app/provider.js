import { createContext, useContext, useState } from "react";

const tupcidContext = createContext();

export default function Provider ({children}){
    const [tupcids, setTupcids] = useState("");

    return(
        <tupcidContext.Provider value={{tupcids,  setTupcids}}>
            {children}
        </tupcidContext.Provider>
    )
};

export const useTupcid = () => useContext(tupcidContext)
