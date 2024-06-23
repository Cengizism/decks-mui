import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCards, getCardBySlug, getDeckTitle } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { Typography, Stack, Breadcrumbs, Link } from "@mui/material";
import CoverImage from "@/app/components/cover-image";
import markdownStyles from "../../../styles/markdown-styles.module.css";
import { get } from "http";

export default async function Card({ params }: Params) {
  const card = getCardBySlug(params.slug);

  if (!card) {
    return notFound();
  }

  const content = await markdownToHtml(card.content || "");

  return (
    <Stack spacing={4}>
      <Typography variant="h2">{card.title}</Typography>
    
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href={`/deck/${card.deck}`}>
          {getDeckTitle(card.deck)}
        </Link>
        <Typography color="text.primary">{card.title}</Typography>
      </Breadcrumbs>

      <article>
        <CoverImage title={card.title} src={card.coverImage} />
        <div
          className={markdownStyles["markdown"]}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </Stack>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  const card = getCardBySlug(params.slug);

  if (!card) {
    return notFound();
  }

  const title = `${card.title} | Next.js based content platform`;

  return {
    title,
    openGraph: {
      title,
      images: [card.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const cards = getAllCards();

  return cards.map((card) => ({
    slug: card.slug,
  }));
}
