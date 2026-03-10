import React from "react";
import { Box, Checkbox, Divider, Typography } from "@mui/material";

export default function AcceptPage({ agree, setAgree }) {
  return (
    <Box textAlign="left">
      <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 2, mt: 8 }}>
        Accept (Name)’s Terms & Review Privacy Notice
      </Typography>
      <Typography sx={{ fontSize: 12, color: "grey.600", mb: 3 }}>
        By selecting “I Agree”, you confirm that you have read and accepted our <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>, and <strong>Cookie Policy</strong>.
      </Typography>
      <Divider sx={{ mb: 3, borderColor: "grey.400", borderBottomWidth: 2 }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography>I Agree</Typography>
        <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />
      </Box>
    </Box>
  );
}