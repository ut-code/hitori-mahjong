import { useState } from "react";
import { Collapse, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import React from "react";

export default function LocalRules() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <Typography
        variant="body1"
        onClick={handleToggle}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <h2>一人麻雀のローカルルールについて</h2>
        {open ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
      </Typography>

      <Collapse in={open}>
        {" "}
        <ul>
          <li>
            牌を18巡ツモって、流局までにアガれたら+8000点、アガれなくても流局時にテンパイしていたら+1000点、イーシャンテンでも+500点となっています。実戦では流局時にイーシャンテンでも点数はもらえないのですが、
            <u>一人麻雀はパズルとして楽しんでほしい</u>
            ので、シャンテン数を進めたということで、点数がもらえます。
          </li>
          <li>
            手牌の画像をクリックしたら、その牌が捨てられ、新しい牌をツモることができます。
          </li>
          <li>
            鳴きやオリといった要素がないので、字牌は牌山に含まれていません。
          </li>
          <li>東風戦になります。東4局でアガるか流局すれば、終局となります。</li>
        </ul>
      </Collapse>
    </>
  );
}
