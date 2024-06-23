import { CardType } from "@/interfaces/cardType";
import fs from "fs";
// @ts-ignore
import matter from "gray-matter"; // TODO: Fix this
import { join } from "path";
import decks from "../../content/decks.json";

const contentDirectory = join(process.cwd(), "content");

export function getCardSlugs() {
  let cardSlugsWithDeck: any = []; // TODO: Fix type any

  decks.forEach((deck: { folderName: string; }) => {
    const deckPath = join(contentDirectory, deck.folderName);
    const slugs = fs.readdirSync(deckPath).map((slug: string) => ({
      slug,
      deck: deck.folderName
    }));
    cardSlugsWithDeck = [...cardSlugsWithDeck, ...slugs];
  });

  return cardSlugsWithDeck;
}

function findDeckByCardSlug(slug: string): string | undefined {
  return decks.find(deck => deck.cards.includes(slug))?.folderName;
}

export function getCardBySlug(slug: string) {
  if (!slug) {
    console.error('Invalid slug parameter:', { slug });
    return null;
  }

  const realSlug = slug.replace(/\.mdx$/, "");
  const deck = findDeckByCardSlug(realSlug);
  const fullPath = join(contentDirectory, deck, `${realSlug}.mdx`);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return { ...data, slug: realSlug, content, deck } as CardType;
  } catch (error) {
    console.error(`Error reading file at path ${fullPath}:`, error);
    return null;
  }
}

export function getAllCards(): CardType[] {
  const slugsWithDeck = getCardSlugs();
  const cards = slugsWithDeck.map(({ slug, deck }: { slug: string, deck: string }) => getCardBySlug(slug));
  return cards;
}