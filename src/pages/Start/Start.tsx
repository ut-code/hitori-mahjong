import { useContext, useState } from "react";
import { PlayerInfoContext } from "../../App";

interface Props {
  setUiState: (uiState: string) => void;
}
export default function Start(props: Props) {
  const [inputText, setInputText] = useState("");
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
  const [clicked, setClicked] = useState(false);

  return (
    <>
      <p>一人麻雀～牌効率について学ぼう～</p>
      {!clicked ? (
        <>
          {" "}
          <input
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            placeholder="ユーザー名"
          />
          <button
            onClick={() => {
              setClicked(true),
                setInputText(""),
                setPlayerInfo((prevInfo) => ({ ...prevInfo, name: inputText }));
            }}
          >
            ユーザー名を決定
          </button>
        </>
      ) : (
        <>
          <p>こんにちは {playerInfo.name}さん！</p>

          <button onClick={() => props.setUiState("Tutorial")}>
            チュートリアルへ
          </button>
        </>
      )}
    </>
  );
}
