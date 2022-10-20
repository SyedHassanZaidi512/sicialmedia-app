import React from "react";
import Navbar from "./Navbar";
import Allposts from "./Allposts";
import "./styles/Home.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Home({ userData,getData }) {

  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
   getData()
  }, [])

  return (
    <div className="home">
      <Navbar userData={userData} />
      {token ? <Allposts userData={userData}/> : <h1>Please Login</h1>}
    </div>
  );
}

export default Home;
