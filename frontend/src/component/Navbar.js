import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PostAddIcon from "@mui/icons-material/PostAdd";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import {  useSelector } from "react-redux";
import "../component/styles/Navbar.css";
import { Link } from "react-router-dom";


function Navbar({ userData }) {

  const token = useSelector((state) => state.auth.token);
  return (                       
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

            <Box sx={{ display: { xs: "none", md: "flex" } }} className="icons">
              <Link  to={token?"/otherusers":"/sign-in"} >
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="default"
                
              >
               <PersonSearchIcon />
              </IconButton>
              </Link>
            <Link to={token?"/create-post":"/sign-in"}> 
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
  );
}

export default Navbar;
