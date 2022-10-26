import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Post.css";

function OtherUserPost({ userData, posts, currentUserData, getData }) {
  const [allPost, setAllPost] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const token = useSelector((state) => state.user.token); //getting token from redux because

  const getUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); //all users
      setAllUser(response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };
  const getPostData = async () => { // to get all the posts getPosts
    try {
      const res = await axios.get("http://localhost:5001/post/all-post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const posts = res.data;
      setAllPost(posts);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const setData = () => { //filetring my posts
    const posts = allPost.filter((post) => {
      return post.userId === userData.id;
    });
    setMyPosts(posts);
  };

  const addCommentFunc = async (postId, userId) => {  //add comment method
    try {
      if (!newComment) {
        return toast.error(`please add some text`);
      }
      const res = await axios.post(
        `http://localhost:5001/comment/add/${postId}`,
        { userId, text: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      getData();
      getPostData();
      getUserData();
      setData();
      setNewComment("");
      return res;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const likeFunc = async (postId, likes) => {
    const result =
      likes.filter((like) => {
        return like.userId === currentUserData.id;
      }).length === 0;
    result === true
      ? addLike(postId)
      : result === false
      ? removeLike(postId)
      : console.log("no function called");
  };

  const addLike = async (
    postId //add Like
  ) => {
    const userId = currentUserData.id;
    if (!postId) {
      return toast.error(`you cannot add`);
    }
    const res = await axios.post(
      `http://localhost:5001/like/add/${postId}`,
      { userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    getData();
    getUserData(); // get all users data
    getPostData();
    return res;
  };

  const removeLike = async ( //remove like
    postId
  ) => {
    try {
      const userId = currentUserData.id;
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
      getData();
      getUserData(); // get all users data
      getPostData();
      return res;
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    getData();
    getPostData();
    getUserData();
  }, [token]);

  useEffect(() => {
    if (userData) {
      setData();
    }
  }, [allPost, userData, addCommentFunc]);

  return posts ? (
    myPosts.map((post) => (
      <div key={post.id} className="post">
        <Card
          variant="outlined"
          sx={{
            minWidth: 50,
            "--Card-radius": (theme) => theme.vars.radius.xs,
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", pb: 1.5, gap: 1 }}>
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
              <Avatar
                size="sm"
                src={userData.picture ? userData.picture : ""}
              />
            </Box>
            <Typography fontWeight="lg">{userData.name}</Typography>
          </Box>
          <CardOverflow>
            <AspectRatio>
              <img src={post.picture ? post.picture : ""} alt="" />
            </AspectRatio>
          </CardOverflow>
          <Box sx={{ display: "flex", alignItems: "center", mx: -1, my: 1 }}>
            <Box sx={{ width: 0, display: "flex", gap: 0.5 }}>
              <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                onClick={() => likeFunc(post.id, post.likes)}
              >
                {post.likes.filter((like) => {
                  return like.userId === currentUserData.id;
                }).length === 0 ? (
                  <FavoriteBorder key={post.userId} />
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
          <Typography fontSize="sm">{post.description}</Typography>
          <Link
            component="button"
            underline="none"
            fontSize="sm"
            startDecorator="…"
            sx={{ color: "text.tertiary" }}
          ></Link>

          {post.comments
            .filter((comment) => {
              return comment.postId === post.id;
            })
            .map((com) => (
              <CardOverflow
                key={com.id}
                sx={{ p: "var(--Card-padding)", display: "flex" }}
              >
                <IconButton
                  size="sm"
                  variant="plain"
                  color="neutral"
                  sx={{ ml: -1 }}
                >
                  {allUser
                    .filter((user) => {
                      return com.userId === user.id;
                    })
                    .map((user) => (
                      <Box>
                        {" "}
                        <Avatar size="sm" key={user.id} src={user.picture} />
                        <Typography>{user.name}</Typography>
                      </Box>
                    ))}
                </IconButton>
                <Input
                  variant="plain"
                  size="sm"
                  disabled
                  placeholder="Add a comment…"
                  value={com.text}
                  sx={{ flexGrow: 1, mr: 1, "--Input-focusedThickness": "0px" }}
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
              <Avatar
                size="sm"
                src={currentUserData.picture ? currentUserData.picture : ""}
              />
            </IconButton>
            <Input
              variant="plain"
              size="sm"
              placeholder="Add a comment…"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ flexGrow: 1, mr: 1, "--Input-focusedThickness": "0px" }}
            />

            <Button onClick={() => addCommentFunc(post.id, currentUserData.id)}>
              Post
            </Button>
          </CardOverflow>
        </Card>
      </div>
    ))
  ) : (
    <h1 style={{ marginTop: "100px" }}>No post </h1>
  );
}

export default OtherUserPost;
