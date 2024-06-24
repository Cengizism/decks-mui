import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDecks, getDeckBySlug, getCardsByDeck } from "@/lib/api";
import {
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Grid,
} from "@mui/material";
import NextLink from "next/link";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";

export default async function Deck({ params }: Params) {
  const deck = getDeckBySlug(params.slug);

  if (!deck) {
    return notFound();
  }

  const cards = getCardsByDeck(deck.folderName);

  return (
    <Stack spacing={4}>
      <Typography variant="h2">{deck.title}</Typography>

      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/" component={NextLink}>
          Home
        </Link>
        <Typography color="text.primary">{deck.title}</Typography>
      </Breadcrumbs>

      <article>
        <Typography variant="body1">{deck.description}</Typography>
      </article>

      {cards.length > 0 && (
        <Grid container spacing={4}>
          {cards.map((card, index) => {
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

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  const deck = getDeckBySlug(params.slug);

  if (!deck) {
    return notFound();
  }

  const title = `${deck.title} | Alten Decks - Deck`;

  return {
    title,
    openGraph: {
      title,
      images: [HOME_OG_IMAGE_URL],
    },
  };
}

export async function generateStaticParams() {
  const decks = getAllDecks();

  return decks.map((deck) => ({
    slug: deck.folderName,
  }));
}
