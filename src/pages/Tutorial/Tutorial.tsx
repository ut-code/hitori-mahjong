import Button from "@mui/material/Button";
import ReactMarkDown from "react-markdown";
import { useState, useEffect } from "react";
import styles from "../../styles/Tutorial.module.css";
import { styled } from "@mui/material";

interface Props {
  setUiState: (uiState: string) => void;
}
export default function Tutorial(props: Props) {
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch("/tutorial.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  });
  return (
    <>
      <div className={styles.textBox}>
        {" "}
        <ReactMarkDown>{content}</ReactMarkDown>
      </div>

      <Button variant="outlined" onClick={() => props.setUiState("Play")}>
        プレイ
      </Button>
    </>
  );
}
