import React from "react";
import Navbar from "./Navbar";
import Allposts from "./Allposts";
import "./styles/Home.css";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";


function Home() {
 
  // const userss = useSelector((state) => state.user.allUserData);
  const token = useSelector((state)=> state.user.token)
  console.log(token,"Data")
  return (
    <div className="home">
      <Navbar  /> 
       {token ? <Allposts /> : <h1>Please Login</h1>}
      <Allposts/>
    </div>
  );
}

export default Home;
