import { join } from "path";
import fs from "fs";
import matter from "gray-matter";
import decks from "../../content/decks.json";
import { CardType, CardSlugType, DeckType } from "@/interfaces/types";

const contentDirectory = join(process.cwd(), "content");

export function getCardSlugs(): CardSlugType[] {
  return decks.flatMap(({ folderName }) => {
    const deckPath = join(contentDirectory, folderName);
    return fs.readdirSync(deckPath).map(slug => ({
      slug,
      deck: folderName
    }));
  });
}

function findDeckFolderNameByCardSlug(slug: string): string | undefined {
  for (const deck of decks) {
    const deckPath = join(contentDirectory, deck.folderName);
    const cardFiles = fs.readdirSync(deckPath);

    if (cardFiles.includes(slug + ".mdx")) {
      return deck.folderName;
    }
  }
  return undefined;
}

export function getDeckTitle(folderName: string): string | undefined {
  const deck = decks.find((deck: DeckType) => deck.folderName === folderName);
  return deck?.title;
}

export function getCardBySlug(slug: string): CardType | null {
  if (!slug) {
    console.error('Invalid slug parameter:', { slug });
    return null;
  }

  const realSlug = slug.replace(/\.mdx$/, "");
  const deck = findDeckFolderNameByCardSlug(realSlug);
  if (!deck) {
    console.error('Deck not found for slug:', { slug });
    return null;
  }
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
  return getCardSlugs().map(({ slug }) => getCardBySlug(slug)).filter(card => card !== null) as CardType[];
}

function readCardFiles(folderName: string): string[] {
  const deckPath = join(contentDirectory, folderName);
  const cardFiles = fs.readdirSync(deckPath);

  // Optionally filter or transform cardFiles here
  return cardFiles;
}

export function getAllDecks(): DeckType[] {
  return decks.map(deck => ({
    ...deck,
    cards: readCardFiles(deck.folderName)
  }));
}

export function getDeckBySlug(slug: string): DeckType | null {
  return decks.find(deck => deck.folderName === slug) || null;
}

export function getCardsByDeck(deck: string): CardType[] {
  return getAllCards().filter(card => card.deck === deck);
}