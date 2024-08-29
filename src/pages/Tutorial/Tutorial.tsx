import Button from "@mui/material/Button";
import styles from "../../styles/Tutorial.module.css";
interface Props {
  setUiState: (uiState: string) => void;
}
export default function Tutorial(props: Props) {
  return (
    <>
      <div className={styles.textBox}>
        <p>
          麻雀は山から牌をツモって捨てることを繰り返し、4面子1雀頭ができたらアガリとなるゲームです。
        </p>
        <p>
          一人麻雀では、アガったら5200点が入り、18巡目までにアガれなかったら3900点を失います。ただ、いつもアガれるわけではないので、8巡目までは「オリ」ボタンを押してオリることができます。オリたら1000点を失います。アガリが見えなかったらオリるのも大切です。
        </p>
      </div>
      <Button variant="outlined" onClick={() => props.setUiState("Play")}>
        プレイ
      </Button>
    </>
  );
}
