import React, { useContext, useState } from "react";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useAuthUser } from "./Context/UserContext";
import { auth } from "../lib/firebase";

export const PasswordInput = () => {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const { user } = useAuthUser();

  const [reauth, setReAuth] = useState(false);
  const handleUpdate = async () => {
    const credentials = EmailAuthProvider.credential(user.email, oldPassword);
    reauthenticateWithCredential(auth.currentUser, credentials)
      .then(() => {
        // User re-authenticated.
        updatePassword(auth.currentUser, password)
          .then(() => {
            alert("Password Updated !");
            setPassword("");
            setOldPassword("");
            setReAuth(false);
          }).then(()=>{
            window.location.replace('/profile')
          }).catch((err) => {
            alert(err.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <div className="d-flex flex-row align-items-center">
        <input
          type="password"
          className="rounded mb-2 form-control w-75 mx-auto"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="btn btn-sm btn-info  rounded-sm"
          onClick={()=>setReAuth(!reauth)}
        >
          <i className="fa-solid fa-check " />
        </button>
      </div>

      {reauth && (
        <>
          <p className="fs-light mb-1 text-info">Verify old password</p>

        <div className="d-flex flex-row align-items-center">
        <input
          type="password"
          className="rounded mb-2 form-control w-75 mx-auto"
          placeholder="old password"
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
          }}
        />
        <button
          className="btn btn-sm btn-info rounded-sm"
          onClick={handleUpdate}
        >
          <i className="fa-solid fa-check" />
        </button>
      </div>
      </>
      )}

    </>
  );
};
