import { useContext, useEffect, useState } from "react";
import { PlayerInfoContext } from "../../App";
import { PlayerInfo } from "../../App";
import { exampleUsers } from "../../utils/exampleUsers";
import Button from "@mui/material/Button";
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

  const containerStyle: { [key: string]: string } = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    minWidth: "400px",
    gap: "16px",
  };

  const topRankingStyle: { [key: string]: string } = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  };

  const rankingItemStyle = (backgroundColor): { [key: string]: string } => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "white",
    borderRadius: "10px",
    fontWeight: "bold",
    color: "#333",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    borderTop: `5px solid ${backgroundColor}`,
    position: "relative",
    width: "200px",
    height: "100px",
  });

  const currentRankingStyle: { [key: string]: string } = {
    backgroundColor: "#FFF7F2",
    color: "#FD903C",
  };

  const rankNumberStyle: { [key: string]: string } = {
    fontSize: "2rem",
    position: "absolute",
    top: "-25px",
  };

  const userRankStyle: { [key: string]: string } = {
    fontSize: "1rem",
    marginTop: "5px",
  };

  const rankListStyle: { [key: string]: string } = {
    width: "100%",
    backgroundColor: "white",
    padding: "0px 16px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
  };

  const rankListTableStyle: { [key: string]: string } = {
    width: "100%",
    padding: "0px",
    borderCollapse: "collapse",
  };

  const footerStyle: { [key: string]: string } = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
    color: "#666",
    fontSize: "0.9rem",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "8px" }}>ランキング</h2>

      <div style={topRankingStyle}>
        <div style={rankingItemStyle("#CDCDCD")}>
          <div style={rankNumberStyle}>2</div>
          <div style={userRankStyle}>ユーザー</div>
          <div>22761</div>
        </div>
        <div style={rankingItemStyle("#DBC27E")}>
          <div style={rankNumberStyle}>1</div>
          <div style={userRankStyle}>ユーザー</div>
          <div>28138</div>
        </div>
        <div style={rankingItemStyle("#DABEB3")}>
          <div style={rankNumberStyle}>3</div>
          <div style={userRankStyle}>ユーザー</div>
          <div>19232</div>
        </div>
      </div>

      <div style={rankListStyle}>
        <table style={rankListTableStyle}>
          <tr>
            <td>4</td>
            <td>ユーザー</td>
            <td>18058</td>
          </tr>
          <tr>
            <td>5</td>
            <td>ユーザー</td>
            <td>15055</td>
          </tr>
          <tr>
            <td>6</td>
            <td>ユーザー</td>
            <td>13044</td>
          </tr>
          <tr style={currentRankingStyle}>
            <td>13</td>
            <td>現在のユーザー</td>
            <td>8581</td>
          </tr>
        </table>
        <div style={footerStyle}>
          <span>🎉 非常に優秀な成績です！この調子で頑張りましょう！</span>
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
