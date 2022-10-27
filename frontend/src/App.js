import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import SignUp from "./component/SignUp.js";
import SignIn from "./component/SignIn";
import { ToastContainer } from "react-toastify";
import Home from "./component/Home";
import Profile from "./component/Profile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./component/CreatePost";
import Settings from "./component/Settings";
import OtherUsers from "./component/OtherUsers";
import OtherUserProfile from "./component/OtherUserProfile";
import FollowingList from "./component/FollowingList.js";
import FollowerList from "./component/FollowerList";
import { getData} from "./redux/userSlice";

function App() {
  const myData = JSON.parse(localStorage.getItem("User"));
  console.log(myData,"myData")
  const dispatch = useDispatch();
  useEffect(() => {
     myData && dispatch(getData(myData.id))
  }, [getData])
  
  const token = useSelector((state) => state.user.token); //getting token from redux
 
  console.log(myData,"userData")

  const userData = useSelector((state)=> state.user.userData)
    
  console.log(userData,"dataofUserfromredux")


  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        margin={200}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <div className="">
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route
            path="/home"
            element={<Home userData={userData}  />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/create-post"
            element={<CreatePost userData={userData} />}
          />
          <Route
            path="/settings"
            element={<Settings userData={userData} getData={getData} />}
          />
          <Route
            path="/otherusers"
            element={<OtherUsers getData={getData} userData={userData} />}
          />
          <Route
            path="/otheruserprofile"
            element={<OtherUserProfile userData={userData} />}
          />
          <Route
            path="/followinglist"
            element={<FollowingList userData={userData} />}
          />
          <Route
            path="/followerlist"
            element={<FollowerList userData={userData} />}
          />
          <Route path="/" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
