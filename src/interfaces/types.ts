export type CardType = {
  slug: string;
  deck: string;
  title: string;
  coverImage: string;
  ogImage: {
    url: string;
  };
  content: string;
};

export interface DeckType {
  folderName: string;
  title: string;
  description: string;
  cards?: string[];
}

export interface CardSlugType {
  slug: string;
  deck: string;
}