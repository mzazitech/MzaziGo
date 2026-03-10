import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function VerifyPage({ code, setCode, firstInputRef, onResend }) {
  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < code.length - 1) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  return (
    <Box textAlign="center">
      <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 2, mt: 8, textAlign: "left" }}>
        Enter the 4-digit code sent to your email / phone
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} mb={1}>
        {code.map((c, i) => (
          <TextField
            key={i}
            id={`code-${i}`}
            inputRef={i === 0 ? firstInputRef : null}
            value={c}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            variant="outlined"
            inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: 24, padding: 12 } }}
            sx={{ width: 60 }}
          />
        ))}
      </Box>
      <Typography sx={{ fontSize: 12, color: "grey.600", textAlign: "left", mb: 4, mt: 3 }}>
        Tip: Make sure to check your inbox and spam folders
      </Typography>
      <Box display="flex" justifyContent="flex-start">
        <Button
          variant="contained"
          onClick={onResend}
          sx={{
            bgcolor: "grey.400",
            color: "black",
            borderRadius: "50px",
            textTransform: "none",
            "&:hover": { bgcolor: "#ECBD35", color: "white" },
          }}
        >
          Resend Code
        </Button>
      </Box>
    </Box>
  );
}