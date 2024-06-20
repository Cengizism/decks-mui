# Decks

This is a statically generated learning platform for Alten consultants.

It is based on NextJS, ReactJS, Google Material Design and TypeScript.

The blog posts are stored in `/_posts` as Markdown files with front matter
support. Adding a new Markdown file in there will create a new content.

To create the blog posts we use [`remark`](https://github.com/remarkjs/remark)
and [`remark-html`](https://github.com/remarkjs/remark-html) to convert the
Markdown files into an HTML string, and then send it down as a prop to the page.
The metadata of every post is handled by
[`gray-matter`](https://github.com/jonschlinkert/gray-matter) and also sent in
props to the page.

## Demo

To be hosted..

## Deploy your own

How to deploy guide..

## How to use

```bash
pnpm install
pnpm dev
```

## Notes

Some additional notes..

## TODOS
- Install `eslint` and `prettier` for code formatting
