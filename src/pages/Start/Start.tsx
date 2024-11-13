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
    const trimmedInput = inputText.trim();

    if (trimmedInput !== "") {
      setPlayerInfo((prevInfo) => ({
        ...prevInfo,
        name: trimmedInput,
      }));
      navigate("/play");
    } else {
      setIsNotValidUserName(true);
    }
  };

  return (
    <>
      <div className={styles.titleContainer}>
        <div className={styles.mainTitle}>ひとり麻雀</div>
        <div className={styles.subTitle}>
          自分のペースで麻雀の基礎を身につけよう
        </div>
      </div>

      <div className={styles.formContainer}>
        <TextField
          label="ユーザーネーム"
          variant="filled"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="ユーザー名を入力"
          autoComplete="off"
          className={styles.textField}
        />

        <Button variant="contained" onClick={handleUserNameSubmit}>
          プレイ
        </Button>
        <Button variant="contained" onClick={() => navigate("/tutorial")}>
          遊び方
        </Button>
        <Button variant="contained" onClick={() => navigate("/result")}>
          ランキング
        </Button>

        {isNotValidUsername && (
          <Alert severity="error">ユーザー名を入力してください</Alert>
        )}
      </div>
    </>
  );
}
