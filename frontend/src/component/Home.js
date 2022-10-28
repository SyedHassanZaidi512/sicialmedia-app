import React from "react";
import Navbar from "./Navbar";
import Allposts from "./Allposts";
import "./styles/Home.css";

function Home({ userData }) {
  const token = localStorage.getItem('Token')
  return (
    <div className="home">
      <Navbar userData={userData} /> 
       {token ? <Allposts userData={userData} /> : <h1>Please Login</h1>}
    </div>
  );
}

export default Home;
