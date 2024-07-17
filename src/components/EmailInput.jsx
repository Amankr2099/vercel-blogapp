import React, { useContext, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthUser } from "./Context/UserContext";
import { db } from "../lib/firebase";

export const EmailInput = () => {
  const { user } = useAuthUser();
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async () => {
    updateDoc(doc(db, "users", user.id), {
      email: email,
    })
      .then(() => {
        alert("Email Updated !");
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
        placeholder={email}
        value={email}
        className="rounded mb-2 form-control w-75 mx-auto"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <button className="btn btn-sm btn-info rounded-sm" onClick={handleUpdate}>
        <i className="fa-solid fa-check " />
      </button>
    </div>
  );
};
