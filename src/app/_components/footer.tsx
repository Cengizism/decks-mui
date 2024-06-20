import { Box, Container, Typography } from "@mui/material";

export function Footer() {
  return (
    <footer>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">Alten Decks 2024</Typography>
        </Box>
      </Container>
    </footer>
  );
}

export default Footer;
