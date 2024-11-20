import { useContext, useEffect, useState } from "react";
import { PlayerInfoContext } from "../../App";
import { PlayerInfo } from "../../App";
import { exampleUsers } from "../../utils/exampleUsers";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FaCrown } from "react-icons/fa";
import React from "react";
import { useNavigate } from "react-router-dom";
import { darken } from "@mui/material/styles";
import RankingTable from "./RankingTable";

export default function Result() {
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
  const [scores, setScores] = useState<PlayerInfo[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`${apiUrl}/result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const sortedScores: PlayerInfo[] = data
          .sort((a: PlayerInfo, b: PlayerInfo) => b.score - a.score)
          .map((player: PlayerInfo, index: number) => ({
            ...player,
            rank: index + 1,
          }));
        setScores(sortedScores);

        const myScore = sortedScores.find(
          (player) => player.name === playerInfo.name,
        );
        if (myScore?.rank != null && myScore.rank > 3) {
          //3位以内をsetMyRankするとエラーが返ってくる
          setMyRank(myScore.rank);
        }
      } catch (e) {
        console.error("Failed to fetch results:", e);
        // エラーが発生した場合はデフォルトの例を表示
        setScores(exampleUsers);
      }
    };

    fetchResult();
  }, []);

  const top1Color = "#DBC27E";
  const top2Color = "#CDCDCD";
  const top3Color = "#DABEB3";

  const containerStyle: { [key: string]: string } = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    minWidth: "400px",
    maxHeight: "800px",
    gap: "16px",
    color: "#2B2B2B",
    backgroundColor: "white",
    borderRadius: "10px",
  };

  const headerStyle: { [key: string]: string } = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
    paddingBottom: "24px",
  };

  const headerTitleStyle: { [key: string]: string } = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  };

  const topRankingStyle: { [key: string]: string } = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    width: "100%",
    alignItems: "flex-end",
  };

  const topRankItemStyle = (
    backgroundColor: string,
  ): { [key: string]: string } => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: "8px",
    backgroundColor: "white",
    borderRadius: "10px",
    fontWeight: "bold",
    color: "#2B2B2B",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    borderTop: `5px solid ${backgroundColor}`,
    position: "relative",
    width: "200px",
    height: "110px",
  });

  const topRankNumberStyle = (
    backgroundColor: string,
  ): { [key: string]: string } => ({
    fontSize: "1.6rem",
    position: "absolute",
    top: "-25px",
    width: "40px",
    height: "40px",
    color: "white",
    background: `linear-gradient(to bottom right, ${backgroundColor}, ${darken(backgroundColor, 0.2)})`,
    borderRadius: "10px",
  });

  const crownIconStyle = (
    backgroundColor: string,
  ): { [key: string]: string } => ({
    position: "absolute",
    top: "-48px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "1.3rem",
    color: backgroundColor,
  });

  const topRankScoreStyle: { [key: string]: string } = {
    fontSize: "2rem",
  };

  const topRankUsernameStyle: { [key: string]: string } = {
    fontSize: "1rem",
  };

  const top1Player: PlayerInfo =
    scores.length > 1 ? scores[0] : exampleUsers[0];
  const top2Player: PlayerInfo =
    scores.length > 2 ? scores[1] : exampleUsers[0];
  const top3Player: PlayerInfo =
    scores.length > 3 ? scores[2] : exampleUsers[0];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <IconButton
          onClick={() => {
            navigate("/");
            setPlayerInfo(() => ({ rank: null, name: "", score: 25000 }));
          }}
        >
          <HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
        </IconButton>
        <h2 style={headerTitleStyle}>ランキング</h2>
      </div>

      {scores.length !== 0 && (
        <>
          <div style={topRankingStyle}>
            <div style={topRankItemStyle(top2Color)}>
              <div style={topRankNumberStyle(top2Color)}>
                <i>2</i>
              </div>
              <div style={topRankUsernameStyle}>
                <span>{top2Player.name}</span>
              </div>
              <div style={topRankScoreStyle}>
                <i>{top2Player.score}</i>
              </div>
            </div>
            <div style={{ ...topRankItemStyle(top1Color), height: "130px" }}>
              <FaCrown style={crownIconStyle(top1Color)} />
              <div style={topRankNumberStyle(top1Color)}>
                <i>1</i>
              </div>
              <div style={topRankUsernameStyle}>{top1Player.name}</div>
              <div style={topRankScoreStyle}>
                <i>{top1Player.score}</i>
              </div>
            </div>
            <div style={topRankItemStyle(top3Color)}>
              <div style={topRankNumberStyle(top3Color)}>
                <i>3</i>
              </div>
              <div style={topRankUsernameStyle}>{top3Player.name}</div>
              <div style={topRankScoreStyle}>
                <i>{top3Player.score}</i>
              </div>
            </div>
          </div>

          <RankingTable
            scores={scores.length > 3 ? scores.slice(3) : []}
            myRank={myRank}
          />
        </>
      )}
    </div>
  );
}
