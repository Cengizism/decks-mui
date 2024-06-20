"use client";

import * as React from "react";
import { type Author } from "@/interfaces/author";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Avatar,
  CardHeader,
  CardActionArea,
  Card,
  CardContent,
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

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  const theme = useTheme();
  const formattedDate = parseISO(date);

  return (
    <Card>
      <CardActionArea href={`/posts/${slug}`} sx={{ display: "flex" }}>
        <CardMedia
          component="img"
          sx={{ width: "50%" }}
          image={coverImage}
          alt={title}
        />

        <Box sx={{ display: "flex", flexDirection: "column" }}>
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
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {excerpt}
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}
