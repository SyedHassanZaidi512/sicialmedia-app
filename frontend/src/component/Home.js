import React from "react";
import Navbar from "./Navbar";
import Allposts from "./Allposts";
import "./styles/Home.css";
// import {ErrorBoundary} from "react-error-boundary"
import { useSelector,useDispatch } from "react-redux";

function Home({userData}) {
   const dispatch = useDispatch()
   
  // const userss = useSelector((state) => state.user.allUserData);
  const token = localStorage.getItem('Token')

  console.log(token,"Data")
  console.log(userData,"userKaData")
  return (
    <div className="home">
      <Navbar userData={userData} /> 
       {token ? <Allposts userData={userData} /> : <h1>Please Login</h1>}
    </div>
  );
}

export default Home;
