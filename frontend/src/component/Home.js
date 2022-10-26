import React from "react";
import Navbar from "./Navbar";
import Allposts from "./Allposts";
import "./styles/Home.css";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";


function Home({userData}) {
   const dispatch = useDispatch()
   
  // const userss = useSelector((state) => state.user.allUserData);
  const token = localStorage.getItem('Token')

  console.log(token,"Data")
  return (
    <div className="home">
      <Navbar  /> 
       {token ? <Allposts /> : <h1>Please Login</h1>}
    </div>
  );
}

export default Home;
