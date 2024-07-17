import { createContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserInfo = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        console.log("No Such User found");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
      const unSub = onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchUserInfo(user.uid);
        }
      });

      return () => {
        unSub();
      };
      
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export {UserContext}