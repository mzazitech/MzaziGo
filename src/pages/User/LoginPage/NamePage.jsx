import React from "react";
import { Box, TextField, Typography } from "@mui/material";

export default function NamePage({ firstName, lastName, setFirstName, setLastName }) {
  return (
    <Box textAlign="center">
      <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 2, mt: 8, textAlign: "left" }}>
        What’s your name?
      </Typography>
      <Typography sx={{ fontSize: 12, color: "grey.600", mb: 5, textAlign: "left" }}>
        Let us know how to properly address you
      </Typography>
      <TextField fullWidth label="First Name" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Last Name" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} />
    </Box>
  );
}