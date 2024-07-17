import React, { useContext, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { upload } from "../lib/upload";
// import parse from "html-react-parser";

export const EditPost = () => {
  const location = useLocation();
  const postId = location.pathname.split("/")[2];

  // const [post, setPost] = useState({});

  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(null);
  const [caption, setCaption] = useState(null);
  const [blogImage, setBlogImage] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [isLoading, setLoading] = useState(false);


  const getBlog = async () => {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // setBlog(docSnap.data());
        setTitle(docSnap.data().blogTitle)
        setCaption(docSnap.data().blogCaption)
        setContent(docSnap.data().blogContent)
        setBlogImage(docSnap.data().blogImage)
        // console.log(docSnap.data().blogTitle);
        
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(()=>{
    getBlog()
  },[postId])

  const handleUpdate = async (e)=>{
    e.preventDefault()
    setLoading(true)
    const data = {}
    if (title) data.blogTitle = title;
    if (caption) data.blogCaption = caption;
    if (content) data.blogContent = content;

    try {
      await updateDoc(doc(db,'posts',postId), data)
    
        alert('Blog Updated')
        window.location.replace(`/post/${postId}`);

    }catch (error) {
      alert(error.message);

    }finally{
      setLoading(false)
    }
  }

  const updateImage = async (e) =>{
    e.preventDefault()
    setLoading(true)
    if (localImage) {
      try {
        const imgURL = await upload(localImage);
        await updateDoc(doc(db,'posts',postId), {blogImage: imgURL})
        setLoading(false)
  
        alert('Image Updated')
  
      } catch (error) {
        alert(error.message);
      }
    }
  }

  var modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  };

  var formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  return (
    <div className=" my-5 bg-white rounded-2 p-2">
      <div className="fs-2 pt-3 text-center">Write a post</div>
      <div className="form-outline" data-mdb-input-init>
        <input
          type="text"
          id="blogTitle"
          className="form-control mt-4 w-75 mx-auto"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <div className="form-outline" data-mdb-input-init>
        <input
          type="text"
          id="blogCaption"
          className="form-control mt-4 w-75 mx-auto"
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
          }}
        />
      </div>

      <img
        src={localImage ? URL.createObjectURL(localImage) : blogImage}
        alt="img"
        className="w-lg-75 w-sm-100 img-fluid py-2 mx-auto d-block"
      />
      {localImage && (
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
        className="mx-auto d-block py-1"
        onChange={(e) => {
          setLocalImage(e.target.files[0]);
        }}
      />

      <div className="w-75 pt-2 mx-auto ">
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          className="text-center fs-sm-6 "
          value={content}
          onChange={(newValue) => setContent(newValue)}
        ></ReactQuill>
      </div>

      <button
        type="button"
        className="btn btn-danger mx-auto d-block m-3 btn-md"
        onClick={handleUpdate}
        disabled={isLoading}
      >
        Update
      </button>

      {/* <button
        type="button"
        className="btn btn-danger mx-auto d-block m-3 btn-md"
        onClick={handleDelete}
      >
        Delete Post
      </button> */}
    </div>
  );
};
