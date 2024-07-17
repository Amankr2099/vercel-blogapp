import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import parse from "html-react-parser";
import { useAuthUser } from "./Context/UserContext";
import {Buffering} from "./Buffering"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const SinglePost = () => {
  const location = useLocation(); 
  const postId = location.pathname.split("/")[2];
  const [buffering,setBuffering] = useState(false)

  const { user } = useAuthUser()

  const [blog, setBlog] = useState(null);

  const getBlog = async () => {
    setBuffering(true)
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBlog(docSnap.data());
        // console.log(docSnap.data());
      }
    } catch (error) {
      alert(error.message);
    }finally{
      setBuffering(false)
    }
  };

  useEffect(() => {
    getBlog();
  }, [postId]);


  return (
    <>
    {
      blog ? (
        <div
      className="container m-5 mx-auto rounded-2"
      style={{ backgroundColor: "rgba(140, 137, 137, 0.5)" }}
    >
      <div className="header text-center p-4 text-white">
        <h1>{blog.blogTitle}</h1>
        <p>{blog.blogCaption}</p>
      </div>
      <img
        src={blog.blogImage}
        className="img-fluid rounded-4 w-100"
        alt="Fissure in Sandstone"
      />

      <div className="container w-lg-75 w-100 my-3 p-2 p-lg-5 ms-auto bg-white rounded-2">
        {parse(String(blog.blogContent))}
        <p className="text-muted my-2">{blog.createdAt}</p>
      </div>
      <div className="fs-5 px-3 pb-2 text-white">
        <p>
          {" "}
          <i className="fa-solid fa-pen px-2" /> Author : {blog.authorName}
        </p>
        {user && (Array.isArray(user.blogList) && user.blogList.includes(postId)) ? (
          <Link to={`/edit-post/${postId}`} className="text-decoration-none"  onClick={()=>{window.scrollTo(0,0)}}>
            <button
              type="button"
              className="btn btn-danger btn-rounded btn-md mt-3 d-block mx-auto"
            >
              Edit
            </button>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
      ):(
        buffering && <Buffering />
      )
    }
    
    </>
  );
};
