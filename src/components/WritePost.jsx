import React, { useContext, useState } from "react";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { upload } from "../lib/upload";
import { useAuthUser } from "./Context/UserContext";

export const WritePost = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [isLoading, setLoading] = useState(false);


  const { user } = useAuthUser();

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imgURL = await upload(blogImage);
      const docRef = await addDoc(collection(db, "posts"), {
        blogTitle: title,
        blogCaption: caption,
        blogContent: content,
        blogImage: imgURL,
        authorName: user.fullname,
        createdAt: new Date().toLocaleDateString("en-GB"),
      });
      console.log("Document written with ID: ", docRef.id);

      await updateDoc(doc(db, "posts", docRef.id), {
        blogId: docRef.id,
      });

      await updateDoc(doc(db, "users", user.id), {
        blogList: arrayUnion(docRef.id),
      });
      alert("Blog Posted");
      window.location.replace(`/post/${docRef.id}`);
    } catch (error) {
      alert(error.message);
    }finally{
      setLoading(false)
    }
  };

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
<div className="my-5 bg-white rounded-2 p-2">
      <div className="fs-2 pt-3 text-center">Write a post</div>
      <div className="form-outline" data-mdb-input-init>
        <input
          type="text"
          id="blogTitle"
          className="form-control mt-4 w-75 mx-auto"
          placeholder="Your Blog Title"
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
          placeholder="Your Blog Caption"
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
          }}
        />
      </div>

      <img
        src={
          blogImage
            ? URL.createObjectURL(blogImage)
            : "https://placehold.co/800x400/?text=Blog+Image"
        }
        alt="img"
        className="w-lg-75 w-sm-100 img-fluid py-2 mx-auto d-block"
      />
      <input
        type="file"
        className="mx-auto d-block py-1"
        onChange={(e) => {
          setBlogImage(e.target.files[0]);
        }}
      />

      <div className="w-75 pt-2 mx-auto ">
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          placeholder="write your content ...."
          className="text-center fs-sm-6 "
          value={content}
          onChange={(newValue) => setContent(newValue)}
        ></ReactQuill>
      </div>

      <button
        type="button"
        className="btn btn-danger mx-auto d-block m-3 btn-md"
        onClick={handlePublish}
        disabled={isLoading}
      >
        Publish
      </button>
    </div>
    
  );
};
