import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../lib/firebase";

const Carousel = () => {
  const [blogs, setBlogs] = useState([])

  const getBlogs = async () => {
      try {
          const res = await getDocs(collection(db,'posts'))
          if (res) {
            const blogIds = new Set();
            setBlogs((prevBlogs) => {
              prevBlogs.forEach(blog => blogIds.add(blog.id));
              res.forEach((doc) => {
                if (!blogIds.has(doc.id)) {
                  blogIds.add(doc.id);
                  prevBlogs = [...prevBlogs, { id: doc.id, ...doc.data() }];
                }
              });
              return prevBlogs;
            });
          }
      } catch (error) {
        alert(error.message)
      } 
  }
  useEffect(()=>{
    getBlogs()
  },[])


  return (
    <>
      <div className="container w-75 mt-5">
        <div id="carouselExampleCaptions" className="carousel slide ">
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            {blogs.slice(1).map((item, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                <Link to={`/post/${item.blogId}`}  onClick={()=>{window.scrollTo(0,0)}}>
                  <img
                    src={item.blogImage ? item.blogImage : "https://via.placeholder.com/600x300?text=Image is not available"}
                    className="d-block w-100"
                    alt="..."
                  />
                </Link>

                  <div className="carousel-caption d-none d-md-block">
                    <h5>{item.blogTitle}</h5>
                    <p>{item.blogCaption}</p>
                  </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Carousel;
