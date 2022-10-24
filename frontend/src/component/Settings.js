import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import "./styles/SignUp.css";
import Navbar from "./Navbar";
import axios from "axios";

function Settings({ userData, getData }) {
  const [oldPassword, setOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [checked, setChecked] = useState("");
  const theme = createTheme();
  const [boolError, setBoolError] = useState(false);
 
  const token = useSelector((state) => state.auth.token); //getting token from redux because

  useEffect(() => {
     getData()
  }, [])
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setBoolError(true)
      const id = userData.id;
      if (newPassword === oldPassword) {
        return toast.error("new and old passoword should not be same");
      }
      setBoolError(true)
      const res = await axios.put(
        `http://localhost:5001/user/editPassword/${id}`,
        { newPassword,oldPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(res.data.statusCode===201)
      {
        return toast.success(res.data.message);
      }
      if (res.data.statusCode === 422 || !res) {
        return toast.error(res.data.message);
      }
      getData()    
    } catch (error) {
      console.log(error,"error")
    }
  };

  const handleChange = () => {
    const bool = checked == 0 ? 1 : 0;
    localStorage.setItem("checked", bool);
    setChecked(localStorage.getItem("checked"));
  };
  return (
    <>
      <Navbar userData={userData} />
      <div>
        <ThemeProvider theme={theme}>
          <Container
            maxWidth="xs"
            sx={{ display: "flex", flexDirection: "column", gap: "2vh" }}
          >
            <CssBaseline />
            <Card>
              <Box
                sx={{
                  marginTop: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                }}
                className="border"
              >
                <div
                  className="App-logo"
                  style={{ color: "HighlightText", fontSize: "40px" }}
                >
                  EditPassword
                </div>
                <Box
                  component="form"
                  noValidate
                  onSubmit={(event) => handleSubmit(event)}
                  sx={{ mt: 5 }}
                >
                  <Grid container spacing={3} item>
                    <Grid item xs={30}>
                      <TextField
                        required
                        fullWidth
                        error={!oldPassword && boolError ? true : false}
                        helperText={!newPassword && boolError ?"old password should not be empty":""}
                        name="Old-password"
                        label="Old-password"
                        type="password"
                        id="Old-password"
                        autoComplete="off"
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        error={!newPassword && boolError ? true : false}
                        helperText={!newPassword && boolError ?"new password should not be empty":""}
                        name="New-password"
                        label="New-password"
                        type="password"
                        id="New-password"
                        autoComplete="off"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Confirm
                  </Button>
                </Box>
              </Box>
            </Card>
            <Card>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box>See private posts</Box>
                <Box>
                  <Switch checked={checked == 0} onChange={handleChange} />
                </Box>
              </Box>
            </Card>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}

export default Settings;
