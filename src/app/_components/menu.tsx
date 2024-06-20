import { Link, Stack } from "@mui/material";
import NextLink from "next/link";
import React from "react";

export default function Menu() {
  return (
    <Stack direction="row">
      <Link href="/" color="secondary" component={NextLink}>
        Home
      </Link>
      &nbsp;|&nbsp;
      <Link href="/about" color="secondary" component={NextLink}>
        About
      </Link>
    </Stack>
  );
}
