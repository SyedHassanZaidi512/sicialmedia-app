import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Post from "./Post";
import Navbar from "./Navbar";
import Gallery from "./Gallery";
import { useEffect, useState } from "react";
import "./styles/Profile.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {getData} from "../redux/userSlice"
function Profile() {
  const [posts, setPosts] = useState("");
  const [post, setPost] = useState(0);
  const [image, setImage] = useState("");
  const myId = JSON.parse(localStorage.getItem('User')).id
  const token = useSelector((state) => state.user.token); //getting token from redux because
  const dispatch = useDispatch();
  const userData = useSelector(state=> (state.user.userData))
  const client = axios.create({
    baseURL: "http://localhost:5001/user",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    getData();
  }, [image,userData]);



  const getData = async () => { 
    try {
      const posts = userData.posts;
      setPosts(posts);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const UploadImage = async (event) => {   //Upload new  image
    setImage(event.target.files[0]);
    dispatch(getData(myId))
    getData();
  };

  const EditImage = async () => {   //save image in
    try {
      const id = userData.id;
      const formdata = new FormData();
      formdata.append("image", image);
      if (image !== "") {
        const res = await client.put(`/editPic/${id}`, formdata);
        return res;
      }
      dispatch(getData(myId))
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    EditImage();
  }, [image]);

  const onLogout = () => {   //Logout func //
    localStorage.removeItem("Token");
  };

  return (
    <div className="profile">
      <Navbar userData={userData} />
      <Card className="card">
        <Avatar
          src={userData.picture ? userData.picture : ""}
          style={{
            width: "200px",
            height: "200px",
          }}
        />

        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            marginLeft: "10%",
            color: "error",
          }}
        >
          <Box display="flex" flexDirection="column" width="100%" color="error">
            <Typography
              sx={{
                fontSize: "h6.fontSize",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {userData.name ? userData.name : "User Name"}
            </Typography>

            <Typography
              sx={{
                width: "100%",
              }}
            >
              {userData.email ? userData.email : "User Name"}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="row" gap="30px">
            <Typography>
              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  color: "black",
                  margin: "0",
                  padding: "0",
                  fontWeight: "bold",
                }}
              >
                {userData.posts ? userData.posts.length : "0"}
              </Link>{" "}
              posts
            </Typography>
            <Typography >
              <Link
                to="/followerlist"
                style={{
                  textDecoration: "none",
                  color: "black",
                  margin: "0",
                  padding: "0",
                  fontWeight: "bold",
                }}
              >
                {userData.followers ? userData.followers.length : "0"}
              </Link>{" "}
              followers
            </Typography>
            <Typography>
              <Link
                to="/followinglist"
                style={{
                  textDecoration: "none",
                  color: "black",
                  margin: "0",
                  padding: "0",
                  fontWeight: "bold",
                }}
              >
                {userData.followings ? userData.followings.length : "0"}
              </Link>{" "}
              following
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="3%"
            width="100%"
            color="error"
            marginLeft="0"
          >
            <Button
              variant="contained"
              component="label"
              sx={{
                width: "10px",
                height: "30px",
                fontSize: "12px",
                backgroundColor: "royalblue",
              }}
            >
              <AddAPhotoIcon />
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                name="image"
                onChange={UploadImage}
              />
            </Button>

            <Link to="/settings" style={{ textDecoration: "none" }}>
              <Button
                type="button"
                variant="contained"
                sx={{
                  width: "10px",
                  height: "30px",
                  fontSize: "12px",
                  backgroundColor: "royalblue",
                }}
              >
                <ManageAccountsIcon />
              </Button>
            </Link>

            <Link to="/sign-in" style={{ textDecoration: "none" }}>
              <Button
                type="button"
                variant="contained"
                sx={{
                  width: "150px",
                  height: "30px",
                  fontSize: "12px",
                  backgroundColor: "red",
                }}
                onClick={onLogout}
              >
                Log out
              </Button>
            </Link>
          </Box>
        </Box>
      </Card>
      <Box
        display="flex"
        flexDirection="row"
        gap="2%"
        width="100%"
        color="success"
        marginLeft="0"
        alignContent="center"
        justifyContent="center"
      >
        <Button
          type="button"
          onClick={() => {
            setPost(0);
          }}
          variant="contained"
          sx={{
            width: "150px",
            height: "30px",
            fontSize: "12px",
            backgroundColor: "seagreen",
          }}
        >
          Posts
        </Button>

        <Button
          type="button"
          onClick={() => {
            setPost(1);
          }}
          variant="contained"
          sx={{
            width: "150px",
            height: "30px",
            fontSize: "12px",
            color: "black",
            backgroundColor: "lightGrey",
          }}
        >
          Gallery
        </Button>
      </Box>
      {posts ? (
        post === 0 ? (
          <Post userData={userData} />
        ) : post === 1 ? (
          <Gallery userData={userData} />
        ) : (
          "nothing to show"
        )
      ) : (
        "No posts to see"
      )}
    </div>
  );
}

export default Profile;
