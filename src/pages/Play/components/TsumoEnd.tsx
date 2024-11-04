import Button from "@mui/material/Button";
import React from "react";

type TsumoEndProps = {
  tsumoEnd: () => void;
};

export default function TsumoEnd(props: TsumoEndProps) {
  return (
    <>
      <div>ツモ！！</div>
      <Button
        variant="contained"
        onClick={props.tsumoEnd}
      >
        確認
      </Button>
    </>
  );
}
