export default function BasicRule() {
  return (
    <>
      <div className="text-2xl font-bold mb-6">
        麻雀の基本的なルールについて
      </div>

      <div className="mb-6">
        <img
          src="/tutorial/exampleTehai.png"
          alt="手牌の例"
          width="700"
          height="80"
        />
      </div>

      <ul className="list-disc ml-6 mb-8 space-y-2">
        <li>手持ちの牌は13枚</li>
        <li>山から1枚引き、1枚捨てる</li>
        <li>これを繰り返し最初にアガった人に得点が入る</li>
        <li>
          アガるためには14枚目を山から引いた時に、面子（メンツ）を3牌1組で4セット、雀頭（ジャントウ）を1組そろえる
        </li>
      </ul>

      <div className="text-xl font-bold my-6">面子（メンツ）とは？</div>
      <p className="mb-4">
        同じ牌3枚（刻子、コーツ）または同じ種類の連続した数字の牌3枚（順子、シュンツ）
      </p>
      <div className="flex gap-5 mb-8">
        <img src="/tutorial/Kotsu.png" alt="刻子" width="160" height="70" />
        <img src="/tutorial/Syuntsu.png" alt="順子" width="160" height="70" />
      </div>

      <div className="text-xl font-bold my-6">雀頭（ジャントウ）とは？</div>
      <p className="mb-4">同じ牌2枚</p>
      <div className="mb-8">
        <img src="/tutorial/Jantou.png" alt="雀頭" width="110" height="70" />
      </div>

      <div className="text-xl font-bold my-6">聴牌（テンパイ）とは？</div>
      <p className="mb-4 leading-relaxed">
        特定の牌を山から持ってくる（<strong>ツモ</strong>
        る）か他家が捨てた牌を持ってきたら（<strong>ロン</strong>
        したら）4面子1雀頭揃う状況のことを<strong>テンパイ</strong>
        しているといいます。例えば以下の手牌は、次に一番右の牌と同じ牌（索子の1、鳥が描かれている牌）を持ってきたら4面子1雀頭揃うので、テンパイしていると言えます。
      </p>
      <div className="mb-6">
        <img
          src="/tutorial/exampleTenpai.png"
          alt="聴牌の例"
          width="700"
          height="90"
        />
      </div>
      <p className="mb-8 leading-relaxed">
        ※実戦では4面子1雀頭揃えてもアガリにはならないことがあります。ポンやチーなどをせずにテンパイしているときに
        <strong>立直（リーチ）</strong>
        することで、立直という役がつき、その牌を持ってきたときにアガリになります。また、立直以外にも役はありますが、初心者のうちはポンやチーなどはせず、立直に向かうことが大切です。
      </p>
      <div className="text-xl font-bold my-6">シャンテン数とは？</div>
      <p className="mb-4 leading-relaxed">
        テンパイまで最短であと何巡必要か、という値のことをシャンテン数と言います。例えば、以下の手牌では、次巡に索子（ソーズ）の3（竹が3つ描かれている牌）か筒子（ピンズ）の3（丸が3つ描かれている牌）を持ってきて、字牌の中（チュン）を捨てればテンパイできるので、1シャンテン（イーシャンテン）であると言えます。
      </p>
      <div className="mb-8">
        <img
          src="/tutorial/Iisyanten.png"
          alt="イーシャンテンの例"
          width="700"
          height="75"
        />
      </div>
      <div className="text-xl font-bold my-6">七対子（チートイツ）とは？</div>
      <p className="mb-6 leading-relaxed">
        麻雀は役がないとアガることができないという話を先ほどしましたが、立直以外にも役はあって、その一つが七対子です。七対子とは読んで字の如く、対子を7個揃えると成立します。覚えるのがとても簡単で、実戦でも高打点を作りたいときに狙います。また一般的には、対子が4つ（七対子の2シャンテン）から、4面子1雀頭揃える手順と七対子に向かう手順のバランスを取るとよいとされています。七対子と区別するために、4面子1雀頭揃えた手のことをメンツ手と言うことがあります。
      </p>
    </>
  );
}
