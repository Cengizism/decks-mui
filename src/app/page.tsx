import * as React from "react";
import { getAllCards } from "@/lib/api";
import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";

export default function Index() {
  const allCards = getAllCards();

  return (
    <Stack spacing={4}>
      <Typography variant="h2">Decks</Typography>

      {allCards.length > 0 && (
        <Stack direction="row" gap={4}>
          {allCards.map((card, index) => {
            return (
              <Card key={index}>
                <CardActionArea href={`/card/${card.slug}`}>
                  <CardHeader
                    title={card.title}
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
                    image={card.coverImage}
                    alt={card.title}
                  />
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
