import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import SignUp from "./component/SignUp.js";
import SignIn from "./component/SignIn";
import { ToastContainer } from "react-toastify";
import Home from "./component/Home";
import Profile from "./component/Profile";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./component/CreatePost";
import Settings from "./component/Settings";
import OtherUsers from "./component/OtherUsers";
import OtherUserProfile from "./component/OtherUserProfile";
import FollowingList from "./component/FollowingList.js";
import FollowerList from "./component/FollowerList";

function App() {
  const [userData, setUserData] = useState("");
  const token = useSelector((state) => state.auth.token); //getting token from redux
  const user = localStorage.getItem("User");
  const getData = async () => { //getting user  data from user id
    console.log("getData");
    try {
      const res = await axios.get(
        `http://localhost:5001/user/getUser/${user}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data, "res");
      setUserData(res.data);
      return res.data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    getData();
    const data = getData();
    console.log(data, "dataof");
    localStorage.setItem("userData", JSON.stringify(userData));
  }, []);

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
            element={<Home getData={getData} userData={userData} />}
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
