# hitori-mahjong

## 環境構築

このリポジトリをクローンし、依存パッケージをインストールします。

```sh
git clone git@github.com:ut-code/hitori-mahjong.git
cd hitori-mahjong
bun install
```

次に、ルートディレクトリに `.env`ファイルを作成してください。（env の内容は Slack の DM で共有します）

## 開発環境
`docker compose up -d` で Docker を立ち上げます。
`bunx primsta db push` でスキーマを反映させます。
`bun dev` で開発環境を立ち上げ、localhost の5173番にアクセスします。
`docker compose down` で Docker を終了します。
