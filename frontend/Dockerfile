# ベースイメージとしてNode.jsを使用
FROM node:16

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をコピー
COPY package.json ./
COPY package-lock.json ./

# 依存関係をインストール
RUN npm install

# Reactのソースコードをコピー
COPY . /app

# 開発サーバを起動（ホットリロード対応）
CMD ["npm", "start"]