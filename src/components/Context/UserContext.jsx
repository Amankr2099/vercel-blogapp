import { createContext, useContext } from "react";
import { UserContext } from "./UserContextProvider";


export const useAuthUser = () => useContext(UserContext)
