import path from "path";
import fs from "fs";
import matter from "gray-matter";
import decks from "../../content/decks.json";
import { CardType, CardSlugType, DeckType } from "@/interfaces/types";

const contentDirectory = path.join(process.cwd(), "content");

const cache = {
  slugs: [] as CardSlugType[],
  cards: new Map<string, CardType>(),
  decks: decks,
};

function readDirectory(folderPath: string): string[] {
  return fs.readdirSync(folderPath);
}

export function getCardSlugs(): CardSlugType[] {
  if (cache.slugs.length > 0) {
    return cache.slugs;
  }

  cache.slugs = decks.flatMap(({ folder }) => {
    const deckPath = path.join(contentDirectory, folder);
    return readDirectory(deckPath).map(slug => ({
      slug: slug.replace(/\.mdx$/, ""),
      deck: folder,
    }));
  });

  return cache.slugs;
}

function findDeckfolderByCardSlug(slug: string): string | undefined {
  for (const deck of decks) {
    const deckPath = path.join(contentDirectory, deck.folder);
    const cardFiles = readDirectory(deckPath);

    if (cardFiles.includes(slug + ".mdx")) {
      return deck.folder;
    }
  }
  return undefined;
}

export function getDeckTitle(folder: string): string | undefined {
  const deck = decks.find((deck: DeckType) => deck.folder === folder);
  return deck?.title;
}

export function getCardBySlug(slug: string): CardType | null {
  if (!slug) {
    console.error("Invalid slug parameter:", { slug });
    return null;
  }

  const realSlug = slug.replace(/\.mdx$/, "");
  if (cache.cards.has(realSlug)) {
    return cache.cards.get(realSlug) || null;
  }

  const deck = findDeckfolderByCardSlug(realSlug);
  if (!deck) {
    console.error("Deck not found for slug:", { slug });
    return null;
  }
  const fullPath = path.join(contentDirectory, deck, `${realSlug}.mdx`);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const card = { ...data, slug: realSlug, content, deck } as CardType;
    cache.cards.set(realSlug, card);
    return card;
  } catch (error) {
    console.error(`Error reading file at path ${fullPath}:`, error);
    return null;
  }
}

export function getAllCards(): CardType[] {
  if (cache.cards.size > 0) {
    return Array.from(cache.cards.values());
  }

  const cards = getCardSlugs().map(({ slug }) => getCardBySlug(slug)).filter(card => card !== null) as CardType[];
  cards.forEach(card => card && cache.cards.set(card.slug, card));
  return cards;
}

function readCardFiles(folder: string): string[] {
  const deckPath = path.join(contentDirectory, folder);
  return readDirectory(deckPath);
}

export function getAllDecks(): DeckType[] {
  return decks.map(deck => ({
    ...deck,
    cards: readCardFiles(deck.folder),
  }));
}

export function getDeckBySlug(slug: string): DeckType | null {
  return decks.find(deck => deck.folder === slug) || null;
}

export function getCardsByDeck(deck: string): CardType[] {
  return getAllCards().filter(card => card.deck === deck);
}
