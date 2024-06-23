import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import NextLink from "next/link";
import StyleIcon from "@mui/icons-material/Style";
import InfoIcon from "@mui/icons-material/Info";

export default function Menu({ open }: { open: boolean }) {
  return (
    <List>
      <ListItem
        disablePadding
        sx={{
          display: "block",
        }}
      >
        <ListItemButton
          href="/"
          component={NextLink}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <StyleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Decks"
            sx={{
              opacity: open ? 1 : 0,
            }}
          />
        </ListItemButton>
      </ListItem>

      <ListItem
        disablePadding
        sx={{
          display: "block",
        }}
      >
        <ListItemButton
          href="/about"
          component={NextLink}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            primary="About"
            sx={{
              opacity: open ? 1 : 0,
            }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
