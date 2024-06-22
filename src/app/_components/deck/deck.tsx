import { Post } from "@/interfaces/post";
import {
  Stack,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

type Props = {
  posts: Post[];
};

export function Deck({ posts }: Props) {
  return (
    posts.length > 0 && (
      <Stack direction="row" gap={5}>
        {posts.map((post, index) => {
          return (
            <Card key={index}>
              <CardActionArea href={`/posts/${post.slug}`}>
                <CardHeader
                  avatar={
                    <Avatar alt={post.author.name} src={post.author.picture} />
                  }
                  title={post.title}
                  subheader={format(post.date, "LLLL	d, yyyy")}
                  titleTypographyProps={{
                    sx: {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    },
                  }}
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={post.coverImage}
                  alt={post.title}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {post.excerpt}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>
    )
  );
}
