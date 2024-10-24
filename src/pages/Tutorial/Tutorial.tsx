import Button from "@mui/material/Button";
import styles from "../../styles/Tutorial.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import BasicRules from "./BasicRules";
import LocalRules from "./LocalRules";

export default function Tutorial() {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.textBox}>
        <BasicRules />
        <LocalRules />
      </div>

      <div className={styles.buttonContainer}>
        <Button variant="contained" onClick={() => navigate("/play")}>
          プレイ
        </Button>
      </div>
    </>
  );
}
