# backend/Dockerfile
FROM python:3.9-slim

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# FastAPI のアプリケーションコードをコピー
COPY ./app /app

# Uvicorn で FastAPI を起動
CMD ["uvicorn", "run:app", "--host", "0.0.0.0", "--port", "8000"]