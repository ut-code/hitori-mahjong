import { useContext, useEffect, useState } from "react";
import { PlayerInfoContext } from "../../App";
import { PlayerInfo } from "../../App";
import { exampleUsers } from "../../utils/exampleUsers";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FaCrown } from "react-icons/fa";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React from "react";
import styles from "../../styles/Result.module.css";
import { useNavigate } from "react-router-dom";
import { darken } from '@mui/material/styles';

export default function Result() {
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
  const [scores, setScores] = useState<PlayerInfo[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch("/result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const sortedScores = data
          .sort((a: PlayerInfo, b: PlayerInfo) => b.score - a.score)
          .slice(0, 10);

        setScores(sortedScores);
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

  const topRankItemStyle = (backgroundColor: string): { [key: string]: string } => ({
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

  const currentRankingStyle: { [key: string]: string } = {
    backgroundColor: "#FFF7F2",
    color: "#FD903C",
  };

  const topRankNumberStyle = (backgroundColor: string): { [key: string]: string } => ({
    fontSize: "1.6rem",
    position: "absolute",
    top: "-25px",
    width: "40px",
    height: "40px",
    color: "white",
    background: `linear-gradient(to bottom right, ${backgroundColor}, ${darken(backgroundColor, 0.2)})`,
    borderRadius: "10px",
  });

  const crownIconStyle = (backgroundColor: string): { [key: string]: string } => ({
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

  const rankListStyle: { [key: string]: string } = {
    width: "100%",
    backgroundColor: "white",
    padding: "0px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
  };

  const rankListTableStyle: { [key: string]: string } = {
    width: "100%",
    padding: "0px",
    borderCollapse: "collapse",
    color: "#2B2B2B",
    fontSize: "1rem",
  };

  const rankItemStyle: { [key: string]: string } = {
    padding: "16px 16px",
  };

  const rankNumberStyle: { [key: string]: string } = {
    fontSize: "0.9rem",
    color: "#7F7E7E",
  };

  const footerStyle: { [key: string]: string } = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "8px 32px",
    color: "#2B2B2B",
    fontSize: "0.9rem",
    gap: "8px",
  };

  const footerEmojiStyle: { [key: string]: string } = {
    fontSize: "1.4rem",
  };

  const top1Player: PlayerInfo = scores.length > 1 ? scores[0] : exampleUsers[0];
  const top2Player: PlayerInfo = scores.length > 2 ? scores[1] : exampleUsers[0];
  const top3Player: PlayerInfo = scores.length > 3 ? scores[2] : exampleUsers[0];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <IconButton
          onClick={() => {
            navigate("/");
            setPlayerInfo(() => ({ name: "", score: 25000 }));
          }}
        >
          <HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
        </IconButton>
        <h2 style={headerTitleStyle}>ランキング</h2>
      </div>

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
        <div style={{...topRankItemStyle(top1Color), height: "130px"}}>
          <FaCrown style={crownIconStyle(top1Color)} />
          <div style={topRankNumberStyle(top1Color)}>
            <i>1</i>
          </div>
          <div style={topRankUsernameStyle}>
            {top1Player.name}
          </div>
          <div style={topRankScoreStyle}>
            <i>{top1Player.score}</i>
          </div>
        </div>
        <div style={topRankItemStyle(top3Color)}>
          <div style={topRankNumberStyle(top3Color)}>
            <i>3</i>
          </div>
          <div style={topRankUsernameStyle}>
            {top3Player.name}
          </div>
          <div style={topRankScoreStyle}>
            <i>{top3Player.score}</i>
          </div>
        </div>
      </div>

      <div style={rankListStyle}>
        <table style={rankListTableStyle}>
          <tr style={rankItemStyle}>
            <td style={rankNumberStyle}>4</td>
            <td>ユーザー</td>
            <td>18058</td>
          </tr>
          <tr style={rankItemStyle}>
            <td style={rankNumberStyle}>5</td>
            <td>ユーザー</td>
            <td>15055</td>
          </tr>
          <tr style={rankItemStyle}>
            <td style={rankNumberStyle}>6</td>
            <td>ユーザー</td>
            <td>13044</td>
          </tr>
          <tr style={currentRankingStyle}>
            <td style={rankNumberStyle}>13</td>
            <td>{playerInfo.name}</td>
            <td>{playerInfo.score}</td>
          </tr>
        </table>
        <div style={footerStyle}>
          <span style={footerEmojiStyle}>🎉</span>
          <span>非常に優秀な成績です！この調子で頑張りましょう！</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sentence}>
          {playerInfo.name}さんの得点は{playerInfo.score}点です。
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Ranking</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((player, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {index + 1 === 1 && (
                    <>
                      <TableCell>
                        <div className={styles.rankOne}>{index + 1}</div>
                      </TableCell>
                      <TableCell>
                        <div className={styles.rankOne}>{player.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className={styles.rankOne}>{player.score}</div>
                      </TableCell>
                    </>
                  )}
                  {index + 1 === 2 && (
                    <>
                      <TableCell>
                        <div className={styles.rankTwo}>{index + 1}</div>
                      </TableCell>
                      <TableCell>
                        <div className={styles.rankTwo}>{player.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className={styles.rankTwo}>{player.score}</div>
                      </TableCell>
                    </>
                  )}
                  {index + 1 === 3 && (
                    <>
                      <TableCell>
                        <div className={styles.rankThree}>{index + 1}</div>
                      </TableCell>
                      <TableCell>
                        <div className={styles.rankThree}>{player.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className={styles.rankThree}>{player.score}</div>
                      </TableCell>
                    </>
                  )}
                  {index + 1 >= 4 && (
                    <>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.score}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/");
            setPlayerInfo(() => ({ name: "", score: 25000 }));
          }}
        >
          スタート画面に戻る
        </Button>
      </div>
    </>
  );
}
