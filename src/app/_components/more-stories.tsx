import { Post } from "@/interfaces/post";
import Card from "./card";
import { Stack, Typography } from "@mui/material";

type Props = {
  posts: Post[];
};

export function MoreStories({ posts }: Props) {
  return (
    <Stack spacing={4}>
      <Typography variant="h4">More Cards</Typography>

      {posts.length > 0 && (
        <Stack direction="row" gap={5}>
          {posts.map((post) => (
            <Card
              key={post.slug}
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
