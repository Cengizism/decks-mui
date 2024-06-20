import * as React from "react";
import { type Author } from "@/interfaces/author";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { parseISO, format } from "date-fns";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export default function RecipeReviewCard({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  const formattedDate = parseISO(date);

  return (
    <Card>
      <CardActionArea href={`/posts/${slug}`}>
        <CardHeader
          avatar={<Avatar alt={author.name} src={author.picture} />}
          title={title}
          subheader={format(date, "LLLL	d, yyyy")}
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
          image={coverImage}
          alt={title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
