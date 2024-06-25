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

const excludeFiles: string[] = ['.DS_Store'];
async function readDirectory(folderPath: string): Promise<string[]> {
  const files = await fs.readdir(folderPath);
  return files.filter(file => !excludeFiles.includes(file));
}

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

export function getDeckTitle(folder: string): string | undefined {
  const deck = decks.find((deck: DeckType) => deck.folder === folder);
  return deck?.title;
}

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

async function readCardFiles(folder: string): Promise<string[]> {
  const deckPath = path.join(contentDirectory, folder);
  return await readDirectory(deckPath);
}

export async function getAllDecks(): Promise<DeckType[]> {
  const deckPromises = decks.map(async deck => ({
    ...deck,
    cards: await readCardFiles(deck.folder),
  }));

  return await Promise.all(deckPromises);
}

export async function getDeckBySlug(slug: string): Promise<DeckType | null> {
  return decks.find(deck => deck.folder === slug) || null;
}

export async function getCardsByDeck(deck: string): Promise<CardType[]> {
  const allCards = await getAllCards();
  return allCards.filter(card => card.deck === deck);
}

function watchDirectory(directory: string) {
  watch(directory, async (eventType, filename) => {
    if (filename && (eventType === "change" || eventType === "rename")) {
      cache.slugs = [];
      cache.cards.clear();

      await getCardSlugs();
      await getAllCards();
      console.log(`Cache updated due to changes in ${directory}`);
    }
  });
}

function startWatchingDeckDirectories() {
  decks.forEach(deck => {
    const deckPath = path.join(contentDirectory, deck.folder);
    watchDirectory(deckPath);
  });
}

(async () => {
  await getCardSlugs();
  await getAllCards();
  startWatchingDeckDirectories();
})();
