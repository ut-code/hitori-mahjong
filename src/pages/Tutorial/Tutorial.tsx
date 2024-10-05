import Button from "@mui/material/Button";
import styles from "../../styles/Tutorial.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Tutorial() {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.textBox}>
        <h1>一人麻雀について</h1>

        <h2>麻雀の基本的なルールについて</h2>
        <img
          src="/tutorial/exampleTehai.png"
          alt="手牌の例"
          width="700"
          height="80"
        />
        <ul>
          <li>手持ちの牌は13枚</li>
          <li>山から1枚引き、1枚捨てる</li>
          <li>これを繰り返し最初にアガった人に得点が入る</li>
          <li>
            アガるためには14枚目を山から引いた時に、面子（メンツ）を3牌1組で4セット、雀頭（ジャントウ）を1組そろえる
          </li>
        </ul>

        <h3>面子（メンツ）とは？</h3>
        <p>
          同じ牌3枚（刻子、コーツ）または同じ種類の連続した数字の牌3枚（順子、シュンツ）
        </p>
        <img
          src="/tutorial/Kotsu.png"
          alt="刻子"
          width="160"
          height="70"
          style={{ marginRight: "20px" }}
        />
        <img src="/tutorial/Syuntsu.png" alt="順子" width="160" height="70" />

        <h3>雀頭（ジャントウ）とは？</h3>
        <p>同じ牌2枚</p>
        <img src="/tutorial/Jantou.png" alt="雀頭" width="110" height="70" />

        <h3>聴牌（テンパイ）とは？</h3>
        <p>
          特定の牌を山から持ってくる（<strong>ツモ</strong>
          る）か他家が捨てた牌を持ってきたら（<strong>ロン</strong>
          したら）4面子1雀頭揃う状況のことを<strong>テンパイ</strong>
          しているといいます。例えば以下の手牌は、次に一番右の牌と同じ牌（索子の1、鳥が描かれている牌）を持ってきたら4面子1雀頭揃うので、テンパイしていると言えます。
        </p>
        <img
          src="/tutorial/exampleTenpai.png"
          alt="聴牌の例"
          width="700"
          height="90"
        />
        <p>
          ※実戦では4面子1雀頭揃えてもアガリにはならないことがあります。ポンやチーなどをせずにテンパイしているときに
          <strong>立直（リーチ）</strong>
          することで、立直という役がつき、その牌を持ってきたときにアガリになります。また、立直以外にも役はありますが、初心者のうちはポンやチーなどはせず、立直に向かうことが大切です。
        </p>
        <h3>シャンテン数とは？</h3>
        <p>
          テンパイまで最短であと何巡必要か、という値のことをシャンテン数と言います。例えば、以下の手牌では、次巡に索子（ソーズ）の3（竹が3つ描かれている牌）か筒子（ピンズ）の3（丸が3つ描かれている牌）を持ってきて、字牌の中（チュン）を捨てればテンパイできるので、1シャンテン（イーシャンテン）であると言えます。
        </p>
        <img
          src="/tutorial/Iisyanten.png"
          alt="イーシャンテンの例"
          width="700"
          height="75"
        />
        <h3>七対子（チートイツ）とは？</h3>
        <p>
          麻雀は役がないとアガることができないという話を先ほどしましたが、立直以外にも役はあって、その一つが七対子です。七対子とは読んで字の如く、対子を7個揃えると成立します。覚えるのがとても簡単で、実戦でも高打点を作りたいときに狙います。また一般的には、対子が4つ（七対子の2シャンテン）から、4面子1雀頭揃える手順と七対子に向かう手順のバランスを取るとよいとされています。七対子と区別するために、4面子1雀頭揃えた手のことをメンツ手と言うことがあります。
        </p>
        <h2>一人麻雀について</h2>

        <ul>
          <li>
            牌を18巡ツモって、流局までにアガれたら+8000点、アガれなくても流局時にテンパイしていたら+1000点、イーシャンテンでも+500点となっています。実戦では流局時にイーシャンテンでも点数はもらえないのですが、一人麻雀はパズルとして楽しんでほしいので、シャンテン数を進めたということで、点数がもらえます。
          </li>
          <li>
            手牌の画像をクリックしたら、その牌が捨てられ、新しい牌をツモることができます。
          </li>
          <li>
            鳴きやオリといった要素がないので、字牌は牌山に含まれていません。
          </li>
        </ul>
      </div>

      <div className={styles.buttonContainer}>
        <Button variant="contained" onClick={() => navigate("/play")}>
          プレイ
        </Button>
      </div>
    </>
  );
}
