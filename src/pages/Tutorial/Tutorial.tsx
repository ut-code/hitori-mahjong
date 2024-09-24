import Button from "@mui/material/Button";
import styles from "../../styles/Tutorial.module.css";
import React from "react";

interface Props {
  setUiState: (uiState: string) => void;
}

export default function Tutorial(props: Props) {
  return (
    <>
      <div className={styles.textBox}>
        <h1>一人麻雀について</h1>

        <h2>麻雀の基本的なルールについて</h2>
        <img
          src="/tutorial/exampleTehai.png"
          alt="手牌の例"
          width="1300"
          height="80"
        />
        <ul>
          <li>手持ちの牌は13枚</li>
          <li>山から1枚引き、不要な牌を捨てる</li>
          <li>これを繰り返し最初にアガった人に得点が入る</li>
          <li>
            アガるためには14枚目を山から引いた時に、面子（メンツ）を3牌1組で4セット、雀頭（アタマ）を1組そろえる
          </li>
        </ul>

        <h3>面子とは？</h3>
        <p>同じ牌3枚または同じ種類の連続した数字の牌3枚</p>
        <img
          src="/tutorial/Kotsu.png"
          alt="刻子"
          width="300"
          height="90"
          style={{ marginRight: "20px" }}
        />
        <img src="/tutorial/Syuntsu.png" alt="順子" width="270" height="90" />

        <h3>雀頭とは？</h3>
        <p>同じ牌2枚</p>
        <img src="/tutorial/Jantou.png" alt="雀頭" width="200" height="90" />

        <h3>テンパイとは？</h3>
        <p>
          特定の牌を山から持ってくる（<strong>ツモ</strong>
          る）か他家が捨てた牌を持ってきたら（<strong>ロン</strong>
          したら）4面子1雀頭揃う状況のことを<strong>テンパイ</strong>
          しているといいます。例えば以下の手牌は、次に一番右の牌と同じ牌を持ってきたら4面子1雀頭揃うので、テンパイしていると言えます。
        </p>
        <img
          src="/tutorial/exampleTenpai.png"
          alt="聴牌の例"
          width="1300"
          height="90"
        />
        <p>
          ※実戦では4面子1雀頭揃えてもアガリにはならないことがあります。ポンやチーなどをせずにテンパイしているときに
          <strong>立直（リーチ</strong>
          ）することで、立直という役がつき、その牌を持ってきたときにアガリになります。また、立直以外にも役はありますが、初心者のうちはポンやチーなどはせず、立直に向かうことが大切です。
        </p>

        <h2>アガリが見えないときは？</h2>
        <p>
          基本的に麻雀はアガリを目指すゲームなのですが、一局でアガれるのは基本一人であり、四人でプレイするゲームなので、どれだけ強い人でもアガり率は25%が関の山です。ただ、アガれない75%の局でも一直線にアガリに向かっていいのかと言うとそうではありません。なぜなら他家のアガリ牌を切ってしまうと、
          <strong>ロン</strong>
          されてしまい、点を失ってしまうからです。そこで、「この手牌はアガれない」と思ったらロンされない牌を切っていって守備に回る（{" "}
          <strong>オリる</strong>
          ）ことが大切です。例えば、6巡目で局も中盤に差し掛かろうというときに以下の手牌だったとしましょう。
        </p>
        <img
          src="/tutorial/badTehai.png"
          alt="アガリが見えない手牌の例"
          width="1300"
          height="90"
        />
        <p>
          6巡目でこの手牌はあまりにも悪くてアガリは到底見えません。そこで、この局は基本的にはロンされにくい牌を抱えて、他家から立直が入ったら、ロンされにく牌を切っていく（
          <strong>オリていく</strong>
          ）ことになります。どういった牌がロンされにくいかという話はとても難しいのですが、ここでは自分の手にアガリが見えなかったらオリるということを覚えていただければ十分です。
        </p>

        <h2>一人麻雀について</h2>
        <p>
          一人麻雀では、牌を18巡ツモって、アガれたら+8000点、アガれなかったら-3900点、8巡目まではオリることができて、オリたら-1000点となっています。一人麻雀を通して、自分の手がアガれるのかどうか客観的に判断し、麻雀の攻撃と守備の基本的なところを学んでいただければ幸いです。
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <Button variant="contained" onClick={() => props.setUiState("Play")}>
          プレイ
        </Button>
      </div>
    </>
  );
}
