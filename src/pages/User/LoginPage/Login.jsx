import React, { useState, useRef } from "react";
import { Box, Paper, Button, IconButton, Dialog, DialogContent, DialogTitle, Slide, ThemeProvider, createTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SignupPage from "./SignupPage";
import VerifyPage from "./VerifyPage";
import NamePage from "./NamePage";
import AcceptPage from "./AcceptPage";
import AllSetPage from "./AllSetPage";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: { primary: { main: "#ECBD35" } },
  typography: { fontFamily: "Poppins, sans-serif" },
});

export default function Login_passenger() {
  const [page, setPage] = useState("signup");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agree, setAgree] = useState(false);
  const [popup, setPopup] = useState(false);
  const firstInputRef = useRef(null);
  const navigate = useNavigate();

  const handleBack = () => {
    const flow = ["signup", "verify", "name", "accept", "allset"];
    const current = flow.indexOf(page);
    if (current > 0) setPage(flow[current - 1]);
  };
  const handleNext = () => {
    if (page === "signup") setPage("verify");
    else if (page === "verify") setPage("name");
    else if (page === "name") setPage("accept");
    else if (page === "accept") setPage("allset");
  };
  const handleResend = () => { setCode(["", "", "", ""]); setPopup(true); };
  const handleClosePopup = () => { setPopup(false); setTimeout(() => firstInputRef.current?.focus(), 100); };

  const isNextDisabled = (page === "verify" && code.some(c => c === "")) || 
                         (page === "name" && (!firstName || !lastName)) || 
                         (page === "accept" && !agree);

  return (    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", display: "flex", flexDirection: "column", pb: page !== "signup" ? "80px" : 0 }}>
        <Paper sx={{ width: "100%", minHeight: "100vh", borderRadius: 0, position: "relative", p: 4, boxSizing: "border-box" }}>
          <Box sx={{ position: "absolute", top: 0, left: 0, width: "100vw", height: 50, bgcolor: "primary.main", zIndex: 10 }} />
          {page === "signup" && <SignupPage email={email} setEmail={setEmail} onNext={() => setPage("verify")} />}
          {page === "verify" && <VerifyPage code={code} setCode={setCode} firstInputRef={firstInputRef} onResend={handleResend} />}
          {page === "name" && <NamePage firstName={firstName} lastName={lastName} setFirstName={setFirstName} setLastName={setLastName} />}
          {page === "accept" && <AcceptPage agree={agree} setAgree={setAgree} />}
          {page === "allset" && <AllSetPage />}

          <Dialog open={popup} onClose={handleClosePopup} hideBackdrop fullWidth TransitionComponent={Slide} PaperProps={{ sx: { borderRadius: "20px 20px 0 0", position: "fixed", bottom: 0, m: 0 } }}>
            <DialogTitle>Resend Code</DialogTitle>
            <DialogContent>
              <Box textAlign="center">
                A new 4-digit code has been sent to your email.
                <Button variant="contained" color="primary" onClick={handleClosePopup}>OK</Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Paper>

        {page !== "signup" && (
          <Box sx={{ position: "fixed", bottom: 0, left: 0, width: "100%", bgcolor: "#fafafa", p: 2, display: "flex", justifyContent: page === "allset" ? "flex-end" : "space-between", alignItems: "center", boxShadow: "0 -2px 8px rgba(0,0,0,0.1)", zIndex: 1000 }}>
            {page !== "allset" && <IconButton onClick={handleBack}><ArrowBackIcon /></IconButton>}
            <Button variant="contained" onClick={page === "allset" ? () => navigate('/') : handleNext} disabled={page !== "allset" && isNextDisabled} sx={{ borderRadius: "50px", bgcolor: page !== "allset" && isNextDisabled ? "grey.400" : "primary.main", "&:hover": { bgcolor: page !== "allset" && isNextDisabled ? "grey.400" : "#D8A71C" }, px: 4, py: 1.5 }}>
              {page === "allset" ? "Continue →" : "Next"}
            </Button>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}