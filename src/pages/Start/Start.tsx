import { useContext, useState } from "react";
import { PlayerInfoContext } from "../../App";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import styles from "../../styles/Start.module.css";

interface Props {
  setUiState: (uiState: string) => void;
}
export default function Start(props: Props) {
  const [inputText, setInputText] = useState("");
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
  const [clicked, setClicked] = useState(false);

  return (
    <>
      <p className={styles.title}>一人麻雀～牌効率について学ぼう～</p>
      {!clicked ? (
        <div className={styles.formContainer}>
          <TextField
            variant="standard"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            placeholder="ユーザー名"
          />
          <Button
            variant="outlined"
            onClick={() => {
              setClicked(true),
                setInputText(""),
                setPlayerInfo((prevInfo) => ({ ...prevInfo, name: inputText }));
            }}
          >
            ユーザー名を決定
          </Button>
        </div>
      ) : (
        <>
          <p>こんにちは {playerInfo.name}さん！</p>
          <div className={styles.buttonContainer}>
            <Button variant="outlined" onClick={() => setClicked(false)}>
              ユーザー名を修正
            </Button>

            <Button
              variant="outlined"
              onClick={() => props.setUiState("Tutorial")}
            >
              チュートリアルへ
            </Button>
          </div>
        </>
      )}
    </>
  );
}
