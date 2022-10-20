import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const Gallery = ({ userData }) => {
  return (
    <div>
      <ImageList sx={{ width: 1200, height: 450 }} cols={3} rowHeight={164}>
        {userData.posts.map((item) => (
          <ImageListItem key={item.id}>
            <img
              src={`${item.picture}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item.picture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default Gallery;
