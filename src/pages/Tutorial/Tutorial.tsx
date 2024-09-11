import Button from "@mui/material/Button";
import ReactMarkDown from "react-markdown";
import { useState, useEffect } from "react";
import styles from "../../styles/Tutorial.module.css";

interface Props {
  setUiState: (uiState: string) => void;
}
export default function Tutorial(props: Props) {
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch("/tutorial/tutorial.mdx")
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
