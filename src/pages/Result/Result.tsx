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

interface Props {
  setUiState: (uiState: string) => void;
}

export default function Result(props: Props) {
  const { playerInfo, setPlayerInfo } = useContext(PlayerInfoContext);
  const [scores, setScores] = useState<PlayerInfo[]>([]);

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

  return (
    <>
      <div>
        {playerInfo.name}さんの得点は{playerInfo.score}点です。
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
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
                <TableCell component="th" scope="row">
                  {player.name}
                </TableCell>
                <TableCell>{player.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="outlined"
        onClick={() => {
          props.setUiState("Start");
          setPlayerInfo(() => ({ name: "", score: 25000 }));
        }}
      >
        もう一回プレイする
      </Button>
    </>
  );
}
