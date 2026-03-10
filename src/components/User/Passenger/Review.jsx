import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";

const Review = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("review"); // review | tip | rate
  const [rating, setRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState("");
  const [customTip, setCustomTip] = useState(""); // Custom Tip
  const [reason, setReason] = useState(""); // Placeholder text

  const handleConfirm = () => navigate("/ride");

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      {/* STEP 1 : Review Question */}
      {step === "review" && (
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 3,
            width: 320,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
            Review
          </Typography>
          <Typography sx={{ fontSize: 16, color: "#666", mt: 1 }}>
            Do you want to rate สมหมาย ?
          </Typography>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#EDEDED",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#dcdcdc" },
              }}
              onClick={() => setStep("tip")}
            >
              No
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ECBD35",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#d6a92f" },
              }}
              onClick={() => setStep("rate")}
            >
              Yes
            </Button>
          </Box>
        </Box>
      )}

      {/* STEP 2 : Tip */}
      {step === "tip" && (
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 3,
            width: 340,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
            Would you like to tip the driver?
          </Typography>

          {/* Amount + Quick Buttons */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: 15 }}>
              Amount (THB)
            </Typography>
            {["10", "20", "50", "100"].map((amount) => (
              <Box
                key={amount}
                onClick={() => {
                  setSelectedTip(amount);
                  setCustomTip(amount);
                }}
                sx={{
                  border: "1px solid #AFAFAF",
                  borderRadius: 2,
                  px: 0.7,
                  py: 0.5,
                  color: selectedTip === amount ? "#000" : "#AFAFAF",
                  bgcolor: selectedTip === amount ? "#F9E6A2" : "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                ฿{amount}
              </Box>
            ))}
          </Box>

          {/* Custom Tip Input */}
          <TextField
            variant="outlined"
            value={customTip}
            onChange={(e) => {
              // รับเฉพาะตัวเลข 0-9
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setCustomTip(onlyNumbers);
            }}
            placeholder="฿00.00"
            fullWidth
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                height: 45,
                bgcolor: "#fff",
                borderRadius: 2,
                border: "1px solid #AFAFAF",
                pr: 1,
              },
              "& .MuiOutlinedInput-input": {
                textAlign: "right",
                color: "#AFAFAF",
                fontWeight: "bold",
              },
            }}
          />

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#ECBD35",
                color: "#000",
                fontWeight: "bold",
                fontSize: "16px",
                "&:hover": { backgroundColor: "#d6a92f" },
              }}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#EDEDED",
                color: "#000",
                fontWeight: "bold",
                fontSize: "16px",

                "&:hover": { backgroundColor: "#dcdcdc" },
              }}
              onClick={handleConfirm}
            >
              Skip
            </Button>
          </Box>
        </Box>
      )}

      {/* STEP 3 : Rate */}
      {step === "rate" && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            bgcolor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
            Review
          </Typography>

          {/* Star Image */}
          <Box
            component="img"
            src="/images/star.png"
            alt="stars"
            sx={{ width: 120, height: 100, mx: "auto", mt: 1 }}
          />

          {/* Profile + Name + Stars */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 2 }}>
            <Box
              component="img"
              src="/images/profile.png"
              alt="profile"
              sx={{ width: 95, height: 80, borderRadius: "50%", flexShrink: 0 }}
            />
            <Box sx={{ textAlign: "left", flexGrow: 1 }}>
              <Typography sx={{ fontWeight: "bold", fontSize: 18, pl: 0.7 }}>
                สมหมาย
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                {[1, 2, 3, 4, 5].map((num) =>
                  num <= rating ? (
                    <StarIcon
                      key={num}
                      onClick={() => setRating(num)}
                      sx={{ color: "#FFD700", cursor: "pointer" }}
                    />
                  ) : (
                    <StarBorderIcon
                      key={num}
                      onClick={() => setRating(num)}
                      sx={{ color: "#FFD700", cursor: "pointer" }}
                    />
                  )
                )}
              </Box>
            </Box>
          </Box>

          {/* Reason */}
          <Typography
            sx={{ fontSize: 14, color: "#667080", mt: 2, textAlign: "left" }}
          >
            Write down the reason
          </Typography>

          <TextField
            multiline
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Placeholder text"
            fullWidth
            minRows={3} // กำหนดขั้นต่ำ
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#EEF1F4",
                borderRadius: 2,
                border: "1px solid #EEF1F4",
                height: 125, // กำหนดสูงตรงนี้
                boxSizing: "border-box", // ทำให้รับ event ครอบคลุมทั้งกรอบ
                "&:hover fieldset": { borderColor: "#EEF1F4" },
              },
              input: {
                color: "#667080",
                padding: "8px", // ใส่ padding ให้กดตรงไหนก็พิมพ์ได้
                height: "100%",
                boxSizing: "border-box",
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#ECBD35",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#d6a92f" },
            }}
            onClick={() => setStep("tip")}
          >
            Confirm
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Review;
