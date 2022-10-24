import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { userCredentials, logOut } from "../auth/authSlice";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./styles/SignUp.css";
import "../App.css";
import axios from "axios";
const theme = createTheme({
  palette: {
    mode: "light",
    color: "success",
  },
});

export default function SignIn() {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [helperText1, setHelperText1] = useState("");
  const [boolError1, setBoolError1] = useState("");
  const [helperText2, setHelperText2] = useState("");
  const [boolError2, setBoolError2] = useState("");
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const emailRefgex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!email || !password || !emailRefgex.test(email)) {
        if (!email) {
          setBoolError1(true);
          setHelperText1("email should not be empty");
        } else if (!emailRefgex.test(email)) {
          setBoolError1(true);
          setHelperText1("inavlid email");
        } else {
          setBoolError1(false);
          setHelperText1("");
        }
        if (!password) {
          setBoolError2(true);
          setHelperText2("password should not b empty");
        } else {
          setBoolError2(false);
          setHelperText2("");
        }
      } else {
   
        const res = await axios.post("http://localhost:5001/user/sign-in", {
          email,
          password,
        });
        if (res.data.statusCode === 401) {
          setBoolError1(true);
          setHelperText1(res.data.message);
        } else {
          setBoolError1(false);
          setHelperText1("");
        }
        if (res.data.statusCode === 402) {
          setBoolError2(true);
          setHelperText2(res.data.message);
        } else if (res.data.statusCode === 422 || !res) {
          const notify = () => toast.error(res.data.message);
          notify();
        } else {
          if (token) {
            dispatch(logOut());
            localStorage.removeItem("Token");
            localStorage.removeItem("User");
            localStorage.removeItem("checked");
            localStorage.removeItem("userData");
            console.log("previous token removed");
          }
          localStorage.setItem("Token", res.data.token);
          localStorage.setItem("User", res.data.user.id);
          dispatch(userCredentials(res.data)); //this is sending token with user data
          Navigate("/home");
        }
      }
    } catch (error) {
      return error.message;
    }
  };
  return (
    <div className="border1">
      <ThemeProvider theme={theme}>
        <Container maxWidth="xs">
          <CssBaseline />
          <Card>
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
              className="border"
            >
              <div className="App-logo">Instagram</div>
              <Box
                component="form"
                noValidate
                onSubmit={(event) => handleSubmit(event)}
                sx={{ mt: 5 }}
              >
                <Grid container spacing={3} item>
                  <Grid item xs={12}>
                    <TextField
                      required
                      error={boolError1}
                      helperText={helperText1}
                      fullWidth
                      name="Email"
                      label="Email"
                      type="Email"
                      id="Email"
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      error={boolError2}
                      helperText={helperText2}
                      autoComplete="off"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Card>

          <Card sx={{ marginTop: "20px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "30px",
              }}
            >
              <Grid item xs={12} cursor="pointer">
                Don't have an account?
                <Link style={{ textDecoration: "none" }} to="/">
                  <Button>Sign Up</Button>
                </Link>
              </Grid>
            </Box>
          </Card>
        </Container>
      </ThemeProvider>
    </div>
  );
}
