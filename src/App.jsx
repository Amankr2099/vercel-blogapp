import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { useAuthUser } from "./components/Context/UserContext";
import { Home } from "./pages/Home";
import { WritePost } from "./components/WritePost";
import {EditPost} from "./components/EditPost"
import {AboutSection} from "./pages/AboutSection"
import {PostsSection} from "./components/PostsSection"
import {ContactSection} from "./pages/ContactSection"
import { SinglePost } from "./components/SinglePost";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import { Layout } from "./pages/Layout";






export const App = () => {
  const {user} = useAuthUser()


  const router = createBrowserRouter(


    createRoutesFromElements(
      <Route path='/' element={<Layout/>}>
        <Route path='' element={<Home/>} />
        <Route path='/about' element={<AboutSection/>}  />
        <Route path='/contact' element={<ContactSection/>} />
        <Route path='/posts' element={<PostsSection/>} />
        <Route path="/post/:id" element={<SinglePost />} />

        <Route path='/signup' element={<SignUp/>} />
        <Route path='/login' element={<Login/>} />

        <Route path='/profile' element={ user? <Profile/>: <Navigate to={'/signup'}/> } />
        <Route path='/write-post' element={user? <WritePost/>: <Navigate to={'/signup'}/>} />
        <Route path='/edit-post/:id' element={user? <EditPost/>: <Navigate to={'/signup'}/>} />


      </Route>
    )
  );

  return (
   
    <RouterProvider router={router}/>

  );
};

