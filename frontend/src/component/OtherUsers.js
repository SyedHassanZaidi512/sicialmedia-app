import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { toast } from "react-toastify";
import "./styles/OtherUser.css";
import axios from "axios";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Avatar from "@mui/material/Avatar";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../component/styles/Navbar.css";
import OtherUserProfile from "./OtherUserProfile";
import { Link } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 4, 1),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

function OtherUsers({ userData, getData }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [showDetails, setShowDetails] = useState(0);
  const [otherUserData, setOtherUserData] = useState([]);
  const token = useSelector((state) => state.user.token); //getting token from redux because

  useEffect(() => {
    getAllUsersData();
  }, []);

  const getAllUsersData = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/user`, {  //getting all  users  data
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleFollow = (id) => {
    const result =
      userData.followings.filter((following) => {
        return following.followingId === id;
      }).length === 0;
    console.log(result, "result");
    result === true
      ? FollowFunc(id)
      : result === false
      ? UnFollowFunc(id)
      : console.log("no function called");
  };

  const FollowFunc = async (id) => { //following method
    setFollowing(id);
    setFollower(id);
    getData();
    getAllUsersData();
  };

  const setFollowing = async (id) => {
    try {
      const userId = userData.id;
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

      getAllUsersData();
      if (user.data.statusCode === 422) {
        return toast.error(user.data.message);
      } else {
        return user.data;
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const setFollower = async (id) => { //set id in follower table of other user (being followed)
    try {
      const userId = id;
      const followerId = userData.id;
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
        console.log(res.data.message, "error");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const UnFollowFunc = (id) => {  //UnFollow Func
    removeFollowing(id);
    removeFollower(id);
  };

  const removeFollowing = async (id) => {
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
      getAllUsersData();
      if (user.data.statusCode === 422) {
        const notify = () => toast.error(user.data.message);
        notify();
      } else {
        return user.data;
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const removeFollower = async (id) => {
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
      getAllUsersData();
      if (res.data.statusCode === 422 || !res) {
      } else {
        getData(); // to see changes immediately
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleClick = (id) => { //show user details
    console.log(id, "userId");
    setShowDetails(1);
    const otherUser = users.filter((user) => {
      return user.id === id;
    });
    setOtherUserData(otherUser);
    console.log(otherUser);
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

              <Search className="search" onClick={() => setShowDetails(0)}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Search>

              <Box sx={{ flexGrow: 1 }} />

              <Box
                sx={{ display: { xs: "none", md: "flex" } }}
                className="icons"
              >
                <Link to={token ? "/otherusers" : "/sign-in"}>
                  <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="default"
                  >
                    <PersonSearchIcon />
                  </IconButton>
                </Link>
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

      {showDetails === 0 ? (
        <div>
          {" "}
          <div className="otherprofile">
            {token
              ? users
                  .filter((user) => {
                    if (search === "") {
                      return null;
                    }
                    //SEARCH by name
                    else if (
                      user.name
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase()) ||
                      user.email
                        .toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase())
                    ) {
                      return user;
                    }
                  })
                  .map((user) => (
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
                      <Link style={{ textDecoration: "none" }}>
                        <Card
                          className="othercard"
                          key={user.id}
                          onClick={() => handleClick(user.id)}
                        >
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
                      </Link>

                      <Button
                        type="button"
                        variant="contained"
                        sx={{
                          width: "9%",
                          height: "30px",
                          fontSize: "12px",
                          backgroundColor: "blue",
                        }}
                        onClick={() => handleFollow(user.id)}
                      >
                        {userData.followings.filter((following) => {
                          return following.followingId === user.id;
                        }).length === 0
                          ? "Follow"
                          : "UnFollow"}
                      </Button>
                    </Box>
                  ))
              : "You are logged Out"}
          </div>
        </div>
      ) : (
        <OtherUserProfile
          otherUserData={otherUserData}
          currentUserData={userData}
          getAllUsersData={getAllUsersData}
          handleClick={handleClick}
          getData={getData}
        />
      )}
    </div>
  );
}

export default OtherUsers;
