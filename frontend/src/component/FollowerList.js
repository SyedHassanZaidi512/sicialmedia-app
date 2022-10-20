import * as React from "react";
import Card from "@mui/material/Card";
import "./styles/OtherUser.css";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PostAddIcon from "@mui/icons-material/PostAdd"; // removed useless imports
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../component/styles/Navbar.css";
import { Link } from "react-router-dom";

function FollowerList({ userData }) { //states
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.auth.token); //getting token from redux because
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/user", {     //get all users when page loaded
      headers: {
        Authorization: `Bearer ${token}`, //recomemded like this  //  done
      },
    });
    setUsers(response.data);
    } catch (err) {
     console.log(err,"error") 
    }
    
  };
  const Myfollower = users.filter((user) => {//filter indentation done and changes done 3
    return userData.followers.map((follower) => follower.followerId).includes(user.id);
  });
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
                    <Avatar
                      src={userData ? userData.picture : ""}
                    />
                  </Stack>
                </Link>
              </Box>
            </Toolbar>
          </AppBar>

        </Box>
      </div>

      <div className="otherprofile">
        {Myfollower.map((user) => (
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
          </Box>
        ))}
      </div>
    </div>
  );
}

export default FollowerList;
