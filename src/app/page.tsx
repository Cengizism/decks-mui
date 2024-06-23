import * as React from "react";
import { getAllCards } from "@/lib/api";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";

export default function Index() {
  const allPosts = getAllCards();

  return (
    <Stack spacing={4}>
      <Typography variant="h2">Decks</Typography>

      {allPosts.length > 0 && (
        <Stack direction="row" gap={4}>
          {allPosts.map((post, index) => {
            return (
              <Card key={index}>
                <CardActionArea href={`/card/${post.slug}`}>
                  <CardHeader
                    title={post.title}
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
      )}
    </Stack>
  );
}
