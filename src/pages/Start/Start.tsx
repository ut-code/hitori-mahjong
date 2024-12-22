import { useContext, useState } from "react";
import { PlayerInfoContext } from "../../App";
import { TextField } from "@mui/material";
import styles from "../../styles/Start.module.css";
import React from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const [inputText, setInputText] = useState("");
  const { setPlayerInfo } = useContext(PlayerInfoContext);
  const [invalidReason, setInvalidReason] = useState<null | string>(null);
  const navigate = useNavigate();

  const handleUserNameSubmit = () => {
    const trimmedInput = inputText.trim();

    if (trimmedInput !== "" && trimmedInput.length > 20) {
      setPlayerInfo((prevInfo) => ({
        ...prevInfo,
        name: trimmedInput,
      }))
      sessionStorage["name"] = trimmedInput;
      navigate("/play");
    } else {
      if (trimmedInput === "") {
        setInvalidReason("ユーザー名を入力してください");
      } else {
        setInvalidReason("名前は 20 文字以下である必要があります")
      }
    }
  };

  return (
    <>
      <a href="https://kf75.utcode.net/" className={styles.home}>
        ＜駒場祭ホームに戻る
      </a>
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
          required={true}
          slotProps={{
            htmlInput:{
            maxLength: 20,
          }}}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="ユーザー名を入力"
          autoComplete="off"
          className={styles.textField}
        />

        <button onClick={handleUserNameSubmit} className={styles.playButton}>
          プレイ
        </button>
        <div className={styles.buttonContainer}>
          <button
            onClick={() => navigate("/tutorial")}
            className={styles.grayButton}
          >
            遊び方
          </button>
          <button
            onClick={() => {
              setPlayerInfo({
                rank: null,
                name: "",
                score: 25000,
              }),
                navigate("/result");
            }}
            className={styles.grayButton}
          >
            ランキング
          </button>
        </div>

        {invalidReason && (
          <Alert severity="error">{invalidReason}</Alert>
        )}
      </div>
    </>
  );
}
