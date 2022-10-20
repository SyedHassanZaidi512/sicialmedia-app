import { Link } from "react-router-dom";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { userCredentials, logOut } from "../auth/authSlice";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import "./styles/SignUp.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Landing from "./Landing";
const client = axios.create({
  baseURL: "http://localhost:5001/user",
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});
const theme = createTheme();
export default function SignUp() {
  const Navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [validate, setValidate] = useState({
    helperText1: "",
    helperText2: "",
    helperText3: "",
  });

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailRefgex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!name) {
      setValidate({ ...validate, helperText1: "name should not be empty" });
      return name;
    } else if (!email) {
      setValidate({ ...validate, helperText2: "password should not be empty" });
      return email;
    } else if (!emailRefgex.test(email)) {
      setValidate({ ...validate, helperText2: "invalid Email" });
      return email;
    } else if (!password) {
      setValidate({ ...validate, helperText3: "password should not be empty" });
      return password;
    } else {
      setValidate({ ...validate, helperText1: "" });
      setValidate({ ...validate, helperText2: "" });
      setValidate({ ...validate, helperText3: "" });
    }

    const formdata = new FormData();
    if (image) {
      formdata.append("image", image, image.name);
    } else {
      formdata.append("image", image);
    }

    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("password", password);
    if (token) {
      dispatch(logOut());
      localStorage.removeItem("Token");
      localStorage.removeItem("User");
      localStorage.removeItem("checked");
      localStorage.removeItem("userData");
    }
    setLoading(true);

    const res = await client.post("/sign-up", formdata);
    if (res) {
      setLoading(false);
    }
    if (res.data.statusCode === 422) {
      const notify = () => toast.error(res.data.message);
      notify();
    } else {
      localStorage.setItem("Token", res.data.token);
      localStorage.setItem("User", res.data.user.id);
      dispatch(userCredentials(res.data)); //this is sending token with user data in redux
      Navigate("/home");
    }
  };
  const UploadImage = (event) => { //Image Uplaod
    setImage(event.target.files[0]);
  };
  console.log(validate.helperText1);
  console.log(validate.helperText2);
  console.log(validate.helperText3);
  return (
    <div className="border1">
      <Landing />
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
              {loading ? <CircularProgress /> : ""}
              <Box
                component="form"
                noValidate
                onSubmit={(event) => handleSubmit(event)}
                sx={{ mt: 5 }}
              >
                <Grid container spacing={3} item>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      autoComplete="off"
                      name="Name"
                      error={validate.helperText1 ? true : false}
                      helperText={validate.helperText1}
                      required
                      fullWidth
                      id="Name"
                      label="Name"
                      autoFocus
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="Email"
                      label="Email"
                      type="Email"
                      id="Email"
                      autoComplete="off"
                      error={validate.helperText2 ? true : false}
                      helperText={validate.helperText2}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      error={validate.helperText3 ? true : false}
                      helperText={validate.helperText3}
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="off"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                    >
                      <div>Upload Your Profile Picture</div>

                      <Button variant="contained" component="label">
                        Upload
                        <input
                          hidden
                          accept="image/*"
                          multiple
                          type="file"
                          name="image"
                          onChange={UploadImage}
                        />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
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
              className=""
            >
              <Grid item xs={12} cursor="pointer">
                Already have an account?
                <Link to="/sign-in">
                  <Button>Sign in</Button>
                </Link>
              </Grid>
            </Box>
          </Card>
        </Container>
      </ThemeProvider>
    </div>
  );
}
