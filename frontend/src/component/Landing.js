import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "../component/styles/Navbar.css";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          component="nav"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <Toolbar>
            <Link style={{ textDecoration: "none", color: "#5856d6" }}>
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
            <Box sx={{ display: { xs: "none", md: "flex" },gap:"1vh",marginRight:"10%" }} >
              <Box
                sx={{ display: { xs: "none", md: "flex" } }}
                
              >
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "#5856d6" }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </Box>
              <Box
                sx={{ display: { xs: "none", md: "flex" } }}
           
              >
                <Link
                  to="/sign-in"
                  style={{ textDecoration: "none", color: "#5856d6" }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                </Link>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default Landing;
