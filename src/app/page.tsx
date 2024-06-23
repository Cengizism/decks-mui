import * as React from "react";
import { getAllCards } from "@/lib/api";
import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import NextLink from "next/link";

export default function Index() {
  const allCards = getAllCards();

  return (
    <Stack spacing={4}>
      <Typography variant="h2">Decks</Typography>

      {allCards.length > 0 && (
        <Grid container spacing={4}>
          {allCards.map((card, index) => {
            return (
              <Grid item key={index} xs={4}>
                <Card
                  sx={{
                    minHeight: { xs: 300, sm: 400 },
                  }}
                >
                  <CardActionArea
                    href={`/card/${card.slug}`}
                    component={NextLink}
                    sx={{
                      zIndex: 1,
                    }}
                  >
                    <CardHeader
                      title={card.title}
                      titleTypographyProps={{
                        sx: {
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: "white",
                        },
                      }}
                      sx={{
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={card.coverImage}
                      alt={card.title}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: { xs: 300, sm: 400 },
                        zIndex: 0,
                      }}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Stack>
  );
}
