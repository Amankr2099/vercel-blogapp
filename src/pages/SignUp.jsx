import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import {upload} from "../lib/upload"
import { doc, setDoc } from "firebase/firestore";

export const SignUp = () => {
  const [isLoading,setLoading] = useState(false)
  const [profilePic, setProfilePic] = useState(null);



  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { fullname, username, email, password } =
      Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgURL = await upload(profilePic);
      await setDoc(doc(db, "users", res.user.uid), {
        displayName: username,
        fullname,
        email,
        photoURL: imgURL,
        id: res.user.uid,
        blogList:[]
      });

      alert("Registerd Successfully")
      window.location.replace('/')
    } catch (error) {
      alert(error.message);

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
      <div className="row gx-lg-5 align-items-center mb-5">
        <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
          <h1
            className="my-5 display-5 fs-1 fw-bold"
            style={{ color: "hsl(218, 81%, 95%)" }}
          >
            Sign Up
            <br />
            <span style={{ color: "hsl(218, 81%, 75%)" }}>
              Get updated on latest cosmic updates
            </span> 
          </h1>
        </div>

        <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
          <div className="card bg-glass">
            <div className="card-body px-4 py-5 px-md-5">
              <form onSubmit={handleSignup}>
                <div className="mb-4 text-center">
                  <img
                    src={
                      profilePic
                        ? URL.createObjectURL(profilePic)
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    className="rounded-circle img-fluid"
                    style={{ width: "100px" }}
                    alt="Profile"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="mx-auto d-block mt-2"
                    name="profilePic"
                    onChange={(e) => {
                      setProfilePic(e.target.files[0]);
                      // console.log(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="form-outline">
                      <input
                        type="text"
                        id="form3Example1"
                        className="form-control"
                        placeholder="Full Name"
                        name="fullname"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-outline">
                      <input
                        type="text"
                        id="form3Example2"
                        className="form-control"
                        placeholder="Username"
                        name="username"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="email"
                    id="form3Example3"
                    className="form-control"
                    placeholder="Email address"
                    name="email"
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="form3Example4"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-block mb-4 mx-auto"
                  // onClick={handleSignup}
                  disabled={isLoading}
                >
                  Sign up
                </button>

                <div className="text-center">
                  <p>Already have an account ? </p>
                  <Link to="/login">Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
