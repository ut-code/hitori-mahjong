import React from "react";
import Button from "@mui/material/Button";

type FinishGameProps = {
  finishGame: () => void;
};
export default function FinishGame(props: FinishGameProps) {
  return (
    <>
      <div>終局</div>
      <Button variant="contained" onClick={props.finishGame}>
        結果画面へ
      </Button>
    </>
  );
}
