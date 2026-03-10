import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";

export default function SignupPage({ email, setEmail, onNext }) {
  return (
    <Box textAlign="center">
      <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 2, mt: 8, textAlign: "left" }}>
        What’s your phone number or email?
      </Typography>
      <TextField
        fullWidth
        label="Phone number or email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={!email}
        onClick={onNext}
        sx={{ mb: 2 }}
      >
        Continue
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.400" }} />
        <Typography sx={{ mx: 2, fontSize: 14, color: "grey.600" }}>or</Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "grey.400" }} />
      </Box>

      <Button
        fullWidth
        variant="contained"
        startIcon={<GoogleIcon sx={{ color: "black" }} />}
        sx={{ mb: 1, textTransform: "none", bgcolor: "grey.300", color: "black", "&:hover": { bgcolor: "grey.400" } }}
      >
        Continue with Google
      </Button>

      <Button
        fullWidth
        variant="contained"
        startIcon={<AppleIcon sx={{ color: "black" }} />}
        sx={{ textTransform: "none", bgcolor: "grey.300", color: "black", "&:hover": { bgcolor: "grey.400" } }}
      >
        Continue with Apple
      </Button>

      <Typography sx={{ mt: 3, fontSize: 12, color: "grey.600", textAlign: "left" }}>
        By continuing, you agree to calls, including by autodialer, WhatsApp, or texts from .... and its affiliates.
      </Typography>
    </Box>
  );
}