import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import OtherUserPost from "./OtherUserPost";
import Gallery from "./Gallery";
import {  useState } from "react";
import "./styles/Profile.css";
import axios from "axios";
import { Link } from "react-router-dom";

function OtherUserProfile({ otherUserData, currentUserData,getAllUsersData }) {
  const [post, setPost] = useState(0);
  const [userData, setUserData] = useState(otherUserData[0]);
  const [posts, setPosts] = useState(otherUserData[0].posts);
  const token =localStorage.getItem('Token')
 
  const handleFollow = () => {
    const result =
      currentUserData.followings.filter((following) => {
        return following.followingId === userData.id;
      }).length === 0;
    result === true
      ? FollowFunc(userData.id)
      : result === false
      ? UnFollowFunc(userData.id)
      : console.log("no function called");
  };

  const FollowFunc = async (id) => {  //following method
    setFollowing(id);
    setFollower(id);
    getAllUsersData();
  };

  const setFollowing = async (id) => {
    try {
      const userId = currentUserData.id;
      const followingId = id;
      const user = await axios.post(
        `http://localhost:5001/following/${userId}`,
        { followingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (user.data.statusCode === 422) {
        return toast.error(user.data.message);
      } else {
        getAllUsersData();
      }     
    } catch (error) {
      console.log(error,"error")
    }
  
  };

  const setFollower = async (id) => { //set id in follower table of other user (being followed)
    try {
      const userId = id;
      const followerId = currentUserData.id;
      const res = await axios.post(
        `http://localhost:5001/follower/${userId}`,
        { followerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.statusCode === 422 || !res) {
        console.log(res.data.message, "error");
      } else {
        getAllUsersData();
        console.log(res.data.message, "error");
      }
    } catch (error) {
       console.log(error,"error") 
    }
  };

  const UnFollowFunc = (id) => {//UnFollow Func
    removeFollowing(id);
    removeFollower(id);
    getAllUsersData();
  };

  const removeFollowing = async (id) => {
    try {
      const userId = currentUserData.id;
      const followingId = id;
      const user = await axios.post(
        `http://localhost:5001/following/unfollow/${userId}`,
        { followingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
   
      if (user.data.statusCode === 422) {
        return user.data.message
      } else {
        getAllUsersData();
      }
    } catch (error) {
      console.log(error,"error")
    }
  };

  const removeFollower = async (id) => {
    try {
      const userId = id;
      const followerId = currentUserData.id;
      const res = await axios.post(
        `http://localhost:5001/follower/unfollow/${userId}`,
        { followerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.statusCode === 422 || !res) {
        return res.data.message
      } else {
        getAllUsersData(); // to see changes immediately
      }
    } catch (error) {
      console.log(error,"error")
    }
  };

  return (
    <div className="profile">
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
            gap: "30px",
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
                to="/OtherUserProfile"
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
            <Typography>
              <Link
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
              type="button"
              variant="contained"
              backgroundColor="blue"
              sx={{
                width: "150px",
                height: "30px",
                fontSize: "12px",
                backgroundColor: "",
              }}
              onClick={handleFollow}
            >
              {currentUserData.followings.filter((following) => {
                return following.followingId === userData.id;
              }).length === 0
                ? "Follow"
                : "UnFollow"}
            </Button>
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
          <OtherUserPost
            posts={userData.posts}
            currentUserData={currentUserData}
            userData={userData}
          />
        ) : post === 1 ? (
          <Gallery userData={userData} />
        ) : (
          "nothing to show"
        )
      ) : (
        <h1>no posts</h1>
      )}
    </div>
  );
}

export default OtherUserProfile;
