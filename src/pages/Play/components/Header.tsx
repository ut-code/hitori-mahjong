import React from "react";
import styles from "../styles/Header.module.css";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { PlayerInfoContext } from "../../../App";
import { useContext } from "react";
import ProgressBar from "./ProgressBar.tsx";

type HeaderProps = {
  kyoku: number;
  junme: number;
};
function Header(props: HeaderProps) {
  const navigate = useNavigate();
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
  const progress = (props.junme / 18) * 100;
  return (
    <div className={styles.header}>
      <IconButton
        onClick={() => {
          navigate("/");
          setPlayerInfo(() => ({ rank: null, name: "", score: 25000 }));
        }}
      >
        <HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
      </IconButton>
      <div className={styles.title}>
        東風戦 東{props.kyoku}局 {playerInfo.score}点
      </div>
      <ProgressBar progress={progress} label={`${props.junme}巡目`} />
    </div>
  );
}

export default Header;
