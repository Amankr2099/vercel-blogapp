import { doc, updateDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { db } from "../lib/firebase";
import { useAuthUser } from "./Context/UserContext";

export const NameInput = ({ name }) => {
  const { user } = useAuthUser();
  const [fullname, setFullName] = useState(user.fullname);


  const handleUpdate = async () => {
    updateDoc(doc(db, "users", user.id), {
      fullname: fullname,
    })
      .then(() => {
        alert("Full Name Updated !");
      }).then(()=>{
        window.location.replace('/profile')
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="d-flex flex-row align-items-center">
<input
      type="text"
      value={fullname}
      placeholder={fullname}
      className="rounded mb-2 form-control w-75 mx-auto"
      onChange={(e) => {
        setFullName(e.target.value);
      }}
    />
    
    <button className="btn btn-sm btn-info rounded-sm" onClick={handleUpdate}>
        <i className="fa-solid fa-check" />
      </button>
    </div>
    
  );
};
