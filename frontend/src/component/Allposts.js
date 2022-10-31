import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Link from "@mui/joy/Link";
import Button from "@mui/material/Button";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder"; //useless things removed
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getData } from "../redux/userSlice";
import { getAllUser } from "../redux/allUserSlice";
import { getPosts } from "../redux/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import "./styles/Post.css";
import axios from "axios";

function Allposts() {
  const users = JSON.parse(localStorage.getItem("User"));
  const id = users.id;
  const token = useSelector((state) => state.user.token); // getting token
  const posts = useSelector((state) => state.post.posts);
  const checked = JSON.parse(localStorage.getItem("checked"));
  const [allUser, setAllUser] = useState(
    useSelector((state) => state.allUser.allUserData)
  );
  const userData = useSelector((state) => state.user.userData);
  const [publicPrivatePosts, setPublicPrivatePosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getPostData();
    getUserData()
    dispatch(getData(id));
    dispatch(getAllUser());
    dispatch(getPosts());
  }, []);

  const getPostData = async () => {// to get all the posts getPosts
    dispatch(getPosts());
    const followingId =userData.followings && userData.followings.length > 0 && userData.followings.map((user) => {
      return user.followingId;
    });
      const myFollowing =
      posts &&
      posts.length > 0 &&
      posts.filter((post) => {
        return followingId && followingId.length>0 && followingId.includes(post.userId);
      });

      checked?setPublicPrivatePosts(myFollowing): setPublicPrivatePosts(posts)
    
  };
  const getUserData = () => {
    dispatch(getAllUser());
    dispatch(getData(id));
  };

  const addCommentFunc = async (postId, userId) => { // naming  done
    if (!newComment) {
      return toast.error(`please add some text`);
    }
    try {
      const res = await axios.post(
        `http://localhost:5001/comment/add/${postId}`,
        {
          userId,
          text: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getUserData(); // get all users data
      getPostData();
      setNewComment("");
      return res;
    } catch (err) {
      console.log(err, "error");
    }
  };

  const likeFunc = async (postId, likes) => {  // naming  done;
    const result =
      likes.filter((like) => {
        return like.userId === userData.id;
      }).length === 0;
    result === true
      ? addLike(postId)
      : result === false
      ? removeLike(postId)
      : console.log("no function called");
      dispatch(getData(id));
      getUserData(); // get all users data
      getPostData();
  };

  const addLike = async (  //add Like
    postId 
  ) => {
    try {
      const userId = userData.id;
    
      if (!postId) {
        return toast.error(`you cannot like`);
      }
      const res = await axios.post(
        `http://localhost:5001/like/add/${postId}`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(getData(id));
      getUserData(); // get all users data
      getPostData();
      return res;
    } catch (err) {
      console.log(err, "error");
    }
  };

  const removeLike = async (postId) => {
    try {
      const userId = userData.id;
      if (!postId) {
        return toast.error(`postId missing`);
      }
      const res = await axios.post(
        `http://localhost:5001/like/remove/${postId}`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getUserData(); // get all users data
      getPostData();
      return res;
    } catch (err) {
      console.log(err, "error");
    }
  };


  useEffect(() => {
    if (userData) {
      getPostData()
    }
  }, [userData]);

  return ( publicPrivatePosts && publicPrivatePosts.length > 0 && publicPrivatePosts.map((post) => (
          <div key={post.id} className="post">
            <Card
              variant="outlined"
              sx={{
                minWidth: 50,
                "--Card-radius": (theme) => theme.vars.radius.xs,
                width: "100%",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", pb: 1.5, gap: 1 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      m: "-2px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                    },
                  }}
                >
                  {post.users.picture && (
                    <Avatar
                      size="sm"
                      src={post.users.picture ? post.users.picture : ""}
                    />
                  )}
                </Box>
                {post.users.name && (
                  <Typography fontWeight="lg">{post.users.name}</Typography>
                )}

                <IconButton
                  variant="plain"
                  color="neutral"
                  size="sm"
                  sx={{ ml: "auto" }}
                >
                  <MoreHoriz />
                </IconButton>
              </Box>
              <CardOverflow>
                <AspectRatio>
                  <img src={post.picture ? post.picture : ""} alt="" />
                </AspectRatio>
              </CardOverflow>
              <Box
                sx={{ display: "flex", alignItems: "center", mx: -1, my: 1 }}
              >
                <Box sx={{ width: 0, display: "flex", gap: 0.5 }}>
                  <IconButton
                    variant="plain"
                    color="neutral"
                    size="sm"
                    onClick={() => likeFunc(post.id, post.likes)}
                  >
                    {post.likes.filter((like) => {
                      return like.userId === userData.id;
                    }).length === 0 ? (
                      <FavoriteBorder key={post.id} />
                    ) : (
                      <FavoriteIcon color="error" />
                    )}
                  </IconButton>
                </Box>
              </Box>
              <Link
                component="button"
                underline="none"
                fontSize="sm"
                fontWeight="lg"
                textColor="text.primary"
              >
                {post.likes.length} Likes
              </Link>
              <Typography fontSize="sm">
                <Link
                  component="button"
                  color="neutral"
                  fontWeight="lg"
                  textColor="text.primary"
                ></Link>{" "}
              </Typography>
              <Link
                component="button"
                underline="none"
                fontSize="sm"
                startDecorator="…"
                sx={{ color: "text.tertiary" }}
              >
                {post.description}
              </Link>
              {post.comments.map((comment) => (
                <CardOverflow
                  sx={{ p: "var(--Card-padding)", display: "flex" }}
                  key={comment.id}
                >
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    sx={{ ml: -1 }}
                  >
                    {allUser &&
                      allUser
                        .filter((user) => {
                          return comment.userId === user.id;
                        })
                        .map((user) => (
                          <Box>
                            {" "}
                            <Avatar size="sm" src={user.picture} />
                            <Typography key={post.id}>{user.name}</Typography>
                          </Box>
                        ))}
                  </IconButton>
                  <Input
                    variant="plain"
                    size="sm"
                    placeholder="Add a comment…"
                    sx={{
                      flexGrow: 1,
                      mr: 1,
                      "--Input-focusedThickness": "0px",
                    }}
                    value={comment.text}
                  />
                </CardOverflow>
              ))}

              <CardOverflow sx={{ p: "var(--Card-padding)", display: "flex" }}>
                <IconButton
                  size="sm"
                  variant="plain"
                  color="neutral"
                  sx={{ ml: -1 }}
                >
                  <Avatar size="sm" src={userData.picture} />
                </IconButton>
                <Input
                  variant="plain"
                  size="sm"
                  value={newComment}
                  placeholder="Add a comment…"
                  sx={{ flexGrow: 1, mr: 1, "--Input-focusedThickness": "0px" }}
                  onChange={(event) => setNewComment(event.target.value)}
                />
                <Button onClick={() => addCommentFunc(post.id, userData.id)}>
                  Post
                </Button>
              </CardOverflow>
            </Card>
          </div>
        ))
  )
}

export default Allposts;
