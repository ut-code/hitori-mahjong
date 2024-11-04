import React from "react";
import Button from "@mui/material/Button";

type DrawEndProps = {
  drawEnd: () => void;
};
export default function DrawEnd(props: DrawEndProps) {
  return (
    <>
      <div>流局</div>
      <Button variant="contained" onClick={props.drawEnd}>
        確認
      </Button>
    </>
  );
}
