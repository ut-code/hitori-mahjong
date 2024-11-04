import React, { useState, useContext } from "react";
import styles from "../styles/Header.module.css";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { PlayerInfoContext } from "../../../App";
import ProgressBar from "./ProgressBar.tsx";

type HeaderProps = {
  kyoku: number;
  junme: number;
};

function Header(props: HeaderProps) {
  const navigate = useNavigate();
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const progress = (props.junme / 18) * 100;

  // Function to handle dialog open
  const handleOpenDialog = () => {
    setOpen(true);
  };

  // Function to handle dialog close
  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    setOpen(false);
    navigate("/");
    setPlayerInfo(() => ({ rank: null, name: "", score: 25000 }));
  };

  return (
    <div className={styles.header}>
      <IconButton onClick={handleOpenDialog}>
        <HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
      </IconButton>

      <div className={styles.title}>
        東風戦 東{props.kyoku}局 {playerInfo.score}点
      </div>
      <ProgressBar progress={progress} label={`${props.junme}巡目`} />

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           遊んだデータが失われますが、スタート画面に戻りますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Header;
