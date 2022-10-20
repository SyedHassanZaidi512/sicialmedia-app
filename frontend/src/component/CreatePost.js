import React from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles"; //removed useless imports
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import "./styles/SignUp.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

function CreatePost({ userData }) {
  const token = useSelector((state) => state.auth.token); // getting token
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState("");
  const [image, setImage] = useState("");
  const [helperText1, setHelperText1] = useState("");
  const [boolError1, setBoolError1] = useState("");
  const [helperText2, setHelperText2] = useState("");
  const [boolError2, setBoolError2] = useState("");
  const [helperText3, setHelperText3] = useState("");
  const [boolError3, setBoolError3] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = createTheme();
  const type = [
    {
      value: "public",
      label: "public",
    },
    {
      value: "private",
      label: "private",
    },
  ];

  const Navigate = useNavigate();
  console.log(userData.id, "id");
  const handleSubmit = async (event) => {
    console.log("abcdef");
    event.preventDefault();
    const formdata = new FormData();
    if (!title || !show || !image || !description) {
      if (!title) {
        setBoolError1(true);
        setHelperText1("title should not be empty");
      } else {
        setBoolError1(false);
        setHelperText1("");
      }

      if (!description) {
        setBoolError2(true);
        setHelperText2("title should not be empty");
      } else {
        setBoolError2(false);
        setHelperText2("");
      }

      if (!show) {
        setBoolError3(true);
        setHelperText3("post type should not be empty");
      } else {
        setBoolError3(false);
        setHelperText3("");
      }

      if (!image) {
        return toast.error("please upload an image");
      }
    } else {
      formdata.append("title", title); // here formData is used for image
      formdata.append("description", description);
      formdata.append("show", show);
      formdata.append("image", image);
      setLoading(true);
      try {
        const res = await axios.post(
          `http://localhost:5001/post/${userData.id}/create-post`,
          formdata, //axios changes done
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res) {
          setLoading(false);
        }
        if (res.data.statusCode === 422 || !res) {
          const notify = () => toast.error(res.data.message);
          notify();
        } else {
          console.log("done");
          Navigate("/profile");
        }
      } catch (err) {
        console.log(err, "error");
      }
    }
  };

  const UploadImage = (event) => {  //Upload Image
    setImage(event.target.files[0]);
  };

  return (
    <>
      <Navbar userData={userData} />
      <div className="create-post">
        <ThemeProvider theme={theme}>
          <Container maxWidth="xs">
            <Card>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                }}
                className="border"
              >
                <div className="App-logo" style={{ color: "HighlightText" }}>
                  Create Post
                </div>
                {loading ? <CircularProgress /> : ""}
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
                        name="title"
                        label="Title"
                        type="text"
                        id="title"
                        autoComplete="off"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={boolError2}
                        helperText={helperText2}
                        required
                        fullWidth
                        name="Descritiion"
                        label="Decription"
                        type="text"
                        id="description"
                        autoComplete="off"
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Type"
                        error={boolError3}
                        helperText={helperText3}
                        value={show}
                        onChange={(e) => setShow(e.target.value)}
                        fullWidth
                        name="type"
                      >
                        {type.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                      >
                        <div>Upload Your Profile Picture</div>

                        <Button
                          variant="contained"
                          component="label"
                          sx={{ backgroundColor: "green" }}
                        >
                          Upload
                          <input
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={UploadImage}
                          />
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Button
                    loading={true}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Card>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}

export default CreatePost;
