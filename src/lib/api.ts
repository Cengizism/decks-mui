import { CardType } from "@/interfaces/cardType";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "content");

export function getCardSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getCardBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as CardType;
}

export function getAllCards(): CardType[] {
  const slugs = getCardSlugs();
  const posts = slugs
    .map((slug) => getCardBySlug(slug))
  return posts;
}
