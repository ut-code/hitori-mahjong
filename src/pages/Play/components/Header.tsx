import React from "react";
import styles from "../styles/Header.module.css";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { PlayerInfoContext } from "../../../App";
import { useContext } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);

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
      <div className={styles.title}>東風戦 東一局 25000点</div>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: "30%" }}></div>
      </div>
      <div className={styles.turnInfo}>15巡目</div>
    </div>
  );
};

export default Header;
