import React from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import BasicRules from "./BasicRules";
import LocalRules from "./LocalRules";

export default function Tutorial() {
  const navigate = useNavigate();

  const containerStyle: { [key: string]: string } = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    minWidth: "400px",
    maxHeight: "800px",
    gap: "16px",
    color: "#2B2B2B",
    backgroundColor: "white",
    borderRadius: "10px",
  };

  const headerStyle: { [key: string]: string } = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
  };

  const headerTitleStyle: { [key: string]: string } = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  };

  const rulesStyle: { [key: string]: string } = {
    overflowY: "scroll",
    textAlign: "left",
    padding: "0 16px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <IconButton
          onClick={() => {
            navigate("/");
          }}
        >
          <HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
        </IconButton>
        <h2 style={headerTitleStyle}>遊び方</h2>
      </div>
      <div style={rulesStyle}>
        <BasicRules />
        <LocalRules />
      </div>
    </div>
  );
}
