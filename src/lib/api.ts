import { join } from "path";
import fs from "fs";
import matter from "gray-matter";
import decks from "../../content/decks.json";
import { CardType, CardSlugType, DeckType } from "@/interfaces/types";

const contentDirectory = join(process.cwd(), "content");

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

  cache.slugs = decks.flatMap(({ folderName }) => {
    const deckPath = join(contentDirectory, folderName);
    return readDirectory(deckPath).map(slug => ({
      slug: slug.replace(/\.mdx$/, ""),
      deck: folderName,
    }));
  });

  return cache.slugs;
}

function findDeckFolderNameByCardSlug(slug: string): string | undefined {
  for (const deck of decks) {
    const deckPath = join(contentDirectory, deck.folderName);
    const cardFiles = readDirectory(deckPath);

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
    console.error("Invalid slug parameter:", { slug });
    return null;
  }

  const realSlug = slug.replace(/\.mdx$/, "");
  if (cache.cards.has(realSlug)) {
    return cache.cards.get(realSlug) || null;
  }

  const deck = findDeckFolderNameByCardSlug(realSlug);
  if (!deck) {
    console.error("Deck not found for slug:", { slug });
    return null;
  }
  const fullPath = join(contentDirectory, deck, `${realSlug}.mdx`);

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

function readCardFiles(folderName: string): string[] {
  const deckPath = join(contentDirectory, folderName);
  return readDirectory(deckPath);
}

export function getAllDecks(): DeckType[] {
  return decks.map(deck => ({
    ...deck,
    cards: readCardFiles(deck.folderName),
  }));
}

export function getDeckBySlug(slug: string): DeckType | null {
  return decks.find(deck => deck.folderName === slug) || null;
}

export function getCardsByDeck(deck: string): CardType[] {
  return getAllCards().filter(card => card.deck === deck);
}
