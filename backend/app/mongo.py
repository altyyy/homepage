from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from contextlib import asynccontextmanager
from pymongo.errors import ConnectionFailure
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId  # ObjectIdをインポート

# MongoDB接続設定
@asynccontextmanager
async def lifespan(app: FastAPI):
    # MongoDBへの非同期接続
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017")  # MongoDBの接続URL
    app.mongodb = app.mongodb_client['homepage']  # 使用するデータベース名

    try:
        # 接続確認: MongoDBサーバーの情報を取得
        server_info = await app.mongodb_client.server_info()
        print("MongoDBに接続しました:", server_info)
    except ConnectionFailure:
        print("MongoDBへの接続に失敗しました")
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    yield
    # シャットダウン時の処理
    app.mongodb_client.close()

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI(lifespan=lifespan)

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 許可するオリジン
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # 許可するHTTPメソッド
    allow_headers=["*"],  # 許可するHTTPヘッダー
)

# MongoDBのObjectIdを文字列に変換する関数
def str_objectid(val):
    if isinstance(val, ObjectId):
        return str(val)  # ObjectIdを文字列に変換
    return val


# Skillモデル
class Skill(BaseModel):
    name: str
    start_date: str  # 日付を文字列（例: "2024/04"）として扱います

# Itemモデル（メインのデータモデル）
class Item(BaseModel):
    # id: str = Field(..., alias="_id")  # ObjectIdを文字列として扱う
    type_code: int
    name: Optional[str] = None
    description: Optional[str] = None
    acquisition_date: Optional[str] = None
    language: Optional[str] = None
    skills: Optional[List[Skill]] = []  # ネストされたskills配列

    class Config:
        # モデルに変換する際の設定
        json_encoders = {
            ObjectId: str_objectid  # ObjectIdを文字列に変換
        }

# データ取得用のエンドポイント
@app.get("/items/", response_model=List[Item])
async def get_items():
    try:
        collection = app.mongodb['homepage']  # 使用するコレクション名
        items_cursor = collection.find()  # MongoDBのfindメソッドで全てのアイテムを取得
        items = await items_cursor.to_list(length=100)  # 最大100件のデータをリストに変換
        if not items:
            raise HTTPException(status_code=404, detail="Items not found")
        return items
    except Exception as e:
        print(f"Error fetching data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch data from database")
