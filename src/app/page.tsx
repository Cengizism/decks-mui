import * as React from "react";
import { Deck } from "@/app/_components/deck/deck";
import { getAllPosts } from "@/lib/api";
import { Stack, Typography } from "@mui/material";

export default function Index() {
  const allPosts = getAllPosts();

  return (
    <>
      <Typography variant="h2">Decks</Typography>

      <Stack spacing={4}>
        <Deck posts={allPosts} />
      </Stack>
    </>
  );
}
