import { useContext, useState } from "react";
import { PlayerInfoContext } from "../../App";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import styles from "../../styles/Start.module.css";
import React from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const [inputText, setInputText] = useState("");
  const { setPlayerInfo } = useContext(PlayerInfoContext);
  const [isNotValidUsername, setIsNotValidUserName] = useState(false);
  const navigate = useNavigate();

  const handleUserNameSubmit = () => {
    if (inputText !== "") {
      setPlayerInfo((prevInfo) => ({
        ...prevInfo,
        name: inputText,
      }));
      navigate("/tutorial");
    } else {
      setIsNotValidUserName(true);
    }
  };

  return (
    <>
      <div className={styles.titleContainer}>
        <div className={styles.mainTitle}>一人麻雀</div>
        <div className={styles.subTitle}>～麻雀の基本を覚えよう～</div>
      </div>

      <div className={styles.formContainer}>
        <TextField
          variant="standard"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="ユーザー名を入力"
          autoComplete='off'
        />

        <Button variant="contained" onClick={handleUserNameSubmit}>
          チュートリアルへ
        </Button>

        {isNotValidUsername && (
          <Alert severity="error">ユーザー名を入力してください</Alert>
        )}
      </div>
    </>
  );
}
