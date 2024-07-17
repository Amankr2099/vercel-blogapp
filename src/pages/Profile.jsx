import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthUser } from "../components/Context/UserContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { upload } from "../lib/upload";
import { doc, updateDoc } from "firebase/firestore";
import { NameInput } from "../components/NameInput";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";

export const Profile = () => {
  const [editOption, setEditOption] = useState(false);
  const { user, setUser } = useAuthUser();
  const inputFile = useRef(null);

  const [profilePic, setProfilePic] = useState(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logged Out")
        window.location.replace('/')
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const updateImage = async() => {
    if (profilePic) {
      const imgURL = await upload(profilePic)
    try {
      await updateDoc(doc(db,"users",user.id),{
        photoURL : imgURL
      })
      setProfilePic(null)
      alert("Image updated")
    } catch (error) {
      alert(error.message)
    }
    }
  }

  const changeImage = () => {
    inputFile.current.click();
  };

  return (
      
    <div className="container w-100 mx-auto my-5 py-5  rounded" style={{ backgroundColor: "rgba(140, 137, 137, 0.5)" }}>
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-md-12 col-xl-4">
          <div className="card rounded-2 my-5">
            <div className="card-body text-center">
              <div className="mt-3 mb-4">
                <img
                  src={
                    profilePic
                      ? URL.createObjectURL(profilePic)
                      : user.photoURL ? (
                        user.photoURL
                      ):(
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                      )
                  }
                  className="rounded-circle object-fit-cover img-fluid"
                  style={{ width: "100px", height: "100px" }}
                  alt="Profile"
                  onClick={changeImage}
                />

                {profilePic && (
                  <button
                    type="button"
                    className="btn btn-info btn-rounded btn-md mt-1 d-block mx-auto"
                    onClick={updateImage}
                  >
                    Update Pic
                  </button>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="d-none"
                  ref={inputFile}
                  onChange={(e) => {
                    setProfilePic(e.target.files[0]);
                  }}
                />
              </div>
              <h4 className="mb-2">{user.fullname}</h4>
              <p className="text-muted mb-3">@Writter </p>
              <p className="mb-5 h5"> {user.blogList.length} blogs written by you </p>

              <div className="d-flex justify-content-around">
                <button
                  type="button"
                  className="btn btn-info btn-rounded btn-md"
                  onClick={() => {
                    setEditOption(!editOption);
                  }}
                >
                  <i
                    className={`fa-solid fa-${
                      editOption ? "xmark" : "pen"
                    } px-2`}
                  />
                  {editOption ? "Cancel" : "Edit Profile"}
                </button>

                <Link to="/write-post"  onClick={()=>{window.scrollTo(0,0)}}>
                  <button
                    type="button"
                    className="btn btn-info btn-rounded btn-md"
                  >
                    <i className="fa-solid fa-file-pen" /> Write
                  </button>
                </Link>
              </div>

              {editOption && (
                <>
                  <div className=" text-center mt-2 mb-2 d-flex flex-column p-2">

                    <NameInput />
                    
                    <EmailInput />

                    <PasswordInput/>
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger btn-rounded btn-lg btn-md-md btn-sm-sm mt-3 d-block mx-auto"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
