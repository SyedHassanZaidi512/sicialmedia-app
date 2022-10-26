import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { toast } from "react-toastify";
import "./styles/OtherUser.css";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../component/styles/Navbar.css";
import { Link } from "react-router-dom";

function FollowingList() {
  const [users, setUsers] = useState([]);
  // const [userData, setUserData] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const token = useSelector((state) => state.user.token); //getting token from redux because problem is solved by adding some logic in redux
  const userData = useSelector((state)=>state.user.userData)

  console.log(userData,"Data");
  const client = axios.create({
    baseURL: "http://localhost:5001/user",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

 
  const getData = async () => {   //get All users Data
    try {
      const res = await client.get(`/`);
      setUsers(res.data);
    } catch (err) {
      console.log(err, "error");
    }
  };

  const setData = () => {
    const MyFollowing = users.filter((user) => {   //Filtering Followings Data from all data   //recommended 3  //done
      console.log(userData.followings,"followings")
      return userData.followings
        .map((following) => following.followingId)
        .includes(user.id);
    });
    setMyFollowing(MyFollowing);
  };

  const UnFollowFunc = (id) => {  //UnFollow Func
    setFollowing(id);
    setFollower(id);
    setData();
    getData();
  };

  const setFollowing = async (id) => {
    try {
      const userId = userData.id;
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
        return toast.error(user.data.message);
      } else {
        return toast.success(`Un Followed`);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const setFollower = async (id) => {
    try {
      const userId = id;
      const followerId = userData.id;
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
      } else {
        getData(); // to see changes immediately
      }
    } catch (err) {
      console.log(err, "error");
    }
  };
  return (
    <div>
      <div className="navbar">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            position="fixed"
            component="nav"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Toolbar>
              <Link
                style={{ textDecoration: "none", color: "#5856d6" }}
                to="/home"
              >
                {" "}
                <Typography
                  className="app-logo "
                  fontFamily="Grand Hotel"
                  fontSize="35px"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Instagram
                </Typography>
              </Link>

              <Box sx={{ flexGrow: 1 }} />

              <Box
                sx={{ display: { xs: "none", md: "flex" } }}
                className="icons"
              >
                <Link to={token ? "/create-post" : "/sign-in"}>
                  {" "}
                  <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="default"
                  >
                    <PostAddIcon />
                  </IconButton>
                </Link>
                <Link
                  style={{ color: "darkblue" }}
                  to={token ? "/profile" : "/sign-in"}
                >
                  <Stack direction="row" spacing={2}>
                    <Avatar src={userData ? userData.picture : ""} />
                  </Stack>
                </Link>
              </Box>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      <div className="otherprofile">
        {myFollowing.map((user) => (
          <Box
            sx={{
              marginTop: 0,
              display: "flex",
              flexDirection: "row",
              gap: "2vw",
              color: "error",
              width: "70vw",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
            key={user.id}
          >
            <Card className="othercard" key={user.id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  color: "error",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "20vw",
                }}
              >
                <Avatar
                  alt=""
                  src={user.picture}
                  style={{
                    width: "10%",
                    height: "10%",
                  }}
                />

                <Box
                  sx={{
                    marginTop: 0,
                    display: "flex",
                    flexDirection: "column",

                    marginLeft: "10%",
                    color: "error",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "h6.fontSize",
                      fontWeight: "bold",
                      width: "100%",
                    }}
                  >
                    {user.name ? user.name : "User Name"}
                  </Typography>

                  <Typography
                    sx={{
                      width: "100%",
                    }}
                  >
                    {user.email ? user.email : "User Name"}
                  </Typography>
                </Box>
              </Box>
            </Card>

            <Button
              type="button"
              variant="contained"
              sx={{
                width: "6%",
                height: "30px",
                fontSize: "11px",
                backgroundColor: "blue",
              }}
              onClick={() => UnFollowFunc(user.id)}
            >
              UnFollow
            </Button>
          </Box>
        ))}
      </div>
    </div>
  );
}

export default FollowingList;
