import path from "path";
import fs from "fs/promises";
import { watch } from "fs";
import matter from "gray-matter";
import decks from "../../content/decks.json";
import { CardType, CardSlugType, DeckType } from "@/interfaces/types";

const contentDirectory = path.join(process.cwd(), "content");

const cache = {
  slugs: [] as CardSlugType[],
  cards: new Map<string, CardType>(),
  decks: decks,
};

// Function to read the contents of a directory
async function readDirectory(folderPath: string): Promise<string[]> {
  return await fs.readdir(folderPath);
}

// Function to get card slugs
export async function getCardSlugs(): Promise<CardSlugType[]> {
  if (cache.slugs.length > 0) {
    return cache.slugs;
  }

  const slugPromises = decks.map(async ({ folder }) => {
    const deckPath = path.join(contentDirectory, folder);
    const slugs = await readDirectory(deckPath);
    return slugs.map(slug => ({
      slug: slug.replace(/\.mdx$/, ""),
      deck: folder,
    }));
  });

  cache.slugs = (await Promise.all(slugPromises)).flat();
  return cache.slugs;
}

// Function to find the deck folder by card slug
async function findDeckFolderByCardSlug(slug: string): Promise<string | undefined> {
  for (const deck of decks) {
    const deckPath = path.join(contentDirectory, deck.folder);
    const cardFiles = await readDirectory(deckPath);

    if (cardFiles.includes(slug + ".mdx")) {
      return deck.folder;
    }
  }
  return undefined;
}

// Function to get the deck title
export function getDeckTitle(folder: string): string | undefined {
  const deck = decks.find((deck: DeckType) => deck.folder === folder);
  return deck?.title;
}

// Function to get card by slug
export async function getCardBySlug(slug: string): Promise<CardType | null> {
  if (!slug) {
    console.error("Invalid slug parameter:", { slug });
    return null;
  }

  const realSlug = slug.replace(/\.mdx$/, "");
  if (cache.cards.has(realSlug)) {
    return cache.cards.get(realSlug) || null;
  }

  const deck = await findDeckFolderByCardSlug(realSlug);
  if (!deck) {
    console.error("Deck not found for slug:", { slug });
    return null;
  }
  const fullPath = path.join(contentDirectory, deck, `${realSlug}.mdx`);

  try {
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const card = { ...data, slug: realSlug, content, deck } as CardType;
    cache.cards.set(realSlug, card);
    return card;
  } catch (error) {
    console.error(`Error reading file at path ${fullPath}:`, error);
    return null;
  }
}

// Function to get all cards
export async function getAllCards(): Promise<CardType[]> {
  if (cache.cards.size > 0) {
    return Array.from(cache.cards.values());
  }

  const slugs = await getCardSlugs();
  const cardPromises = slugs.map(({ slug }) => getCardBySlug(slug));
  const cards = (await Promise.all(cardPromises)).filter(card => card !== null) as CardType[];
  cards.forEach(card => card && cache.cards.set(card.slug, card));
  return cards;
}

// Function to read card files
async function readCardFiles(folder: string): Promise<string[]> {
  const deckPath = path.join(contentDirectory, folder);
  return await readDirectory(deckPath);
}

// Function to get all decks
export async function getAllDecks(): Promise<DeckType[]> {
  const deckPromises = decks.map(async deck => ({
    ...deck,
    cards: await readCardFiles(deck.folder),
  }));

  return await Promise.all(deckPromises);
}

// Function to get deck by slug
export async function getDeckBySlug(slug: string): Promise<DeckType | null> {
  return decks.find(deck => deck.folder === slug) || null;
}

// Function to get cards by deck
export async function getCardsByDeck(deck: string): Promise<CardType[]> {
  const allCards = await getAllCards();
  return allCards.filter(card => card.deck === deck);
}

// Function to watch directory for changes
function watchDirectory(directory: string) {
  watch(directory, async (eventType, filename) => {
    if (filename && eventType === "change" || eventType === "rename") {
      // Clear caches related to the directory
      cache.slugs = [];
      cache.cards.clear();

      // Re-populate caches
      await getCardSlugs();
      await getAllCards();
      console.log(`Cache updated due to changes in ${directory}`);
    }
  });
}

// Start watching all deck directories
function startWatchingDeckDirectories() {
  decks.forEach(deck => {
    const deckPath = path.join(contentDirectory, deck.folder);
    watchDirectory(deckPath);
  });
}

// Initialize cache and start watching directories
(async () => {
  await getCardSlugs();
  await getAllCards();
  startWatchingDeckDirectories();
})();
