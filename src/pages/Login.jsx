import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export const Login = () => {
  
  const [isLoading,setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const { email, password } = Object.fromEntries(formData);
    console.log(email);

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        //  console.log(user);
          alert("Logged Successfully");
          window.location.replace('/')
      }
      
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
      <div className="row gx-lg-5 align-items-center mb-5">
        <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
          <div className="card bg-glass">
            <div className="card-body px-4 py-5 px-md-5">
              <form onSubmit={handleLogin}>

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
                  className="btn btn-primary d-block mx-auto mb-4"
                  // disabled={isLoading}
                >
                  Login
                </button>

                <div className="text-center">
                  <p>Don't have an account ? </p>
                  <Link to="/signup">Sign Up</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
          <h1
            className="my-5 display-5 fs-1 fw-bold"
            style={{ color: "hsl(218, 81%, 95%)" }}
          >
            Welcome back !
            <br />
            <span style={{ color: "hsl(218, 51%, 80%)" }}>
              Start writing your knowledge
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};
