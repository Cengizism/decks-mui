import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCards, getCardBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { Typography, Stack } from "@mui/material";
import CoverImage from "@/app/components/cover-image";
import markdownStyles from "../../../styles/markdown-styles.module.css";

export default async function Card({ params }: Params) {
  const card = getCardBySlug(params.slug);

  if (!card) {
    return notFound();
  }

  const content = await markdownToHtml(card.content || "");

  return (
    <Stack spacing={4}>
      <Typography variant="h2">{card.title}</Typography>
      <Typography variant="body1">{card.deck}</Typography>

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
