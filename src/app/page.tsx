import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Menu from "@/app/_components/menu";
import HeroPost from "@/app/_components/hero-post";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { Stack, Typography } from "@mui/material";

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Menu />
        <Typography variant="h2">Home</Typography>

        <Stack spacing={4}>
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />

          <MoreStories posts={morePosts} />
        </Stack>
      </Box>
    </Container>
  );
}
