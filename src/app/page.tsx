import * as React from "react";
import { getAllDecks } from "@/lib/api";
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
  const allDecks = getAllDecks();

  return (
    <Stack spacing={4}>
      <Typography variant="h2">Decks</Typography>

      {allDecks.length > 0 && (
        <Grid container spacing={4}>
          {allDecks.map((deck, index) => {
            return (
              <Grid item key={index} xs={4}>
                <Card
                  sx={{
                    minHeight: { xs: 300, sm: 400 },
                  }}
                >
                  <CardActionArea
                    href={`/deck/${deck.folder}`}
                    component={NextLink}
                    sx={{
                      zIndex: 1,
                    }}
                  >
                    <CardHeader
                      title={deck.title}
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
                      // image={deck.coverImage}
                      // alt={deck.title}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: { xs: 300, sm: 400 },
                        zIndex: 0,
                        backgroundColor: "RGBA(0,0,0,0.5)",
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
