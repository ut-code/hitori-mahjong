# hitori-mahjong

## 環境構築

このリポジトリをクローンし、依存パッケージをインストールします。

```sh
git clone git@github.com:ut-code/hitori-mahjong.git
cd hitori-mahjong
bun install
```

次に、ルートディレクトリに `.env`ファイルを作成してください。（envの内容はSlackのDMで共有します）

## 開発環境

`make dev` で開発環境を立ち上げ、localhostの5173番にアクセスします。

## 本番環境

`make start` で開発環境を立ち上げ、localhostの3001番にアクセスします。
