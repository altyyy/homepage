import React, { useEffect, useState } from 'react';

// アイテムの型を定義
interface Item {
  _id: string;  // MongoDBのObjectId（文字列として扱います）
  name: string;
  description: string;
}

function IntroductionType() {
  // itemsの型を指定して、useStateを定義
  const [items, setItems] = useState<Item[]>([]);  // データを保存するための状態

  useEffect(() => {
    // FastAPIサーバーからデータを取得
    fetch('http://localhost:8000/items/')
      .then((response) => response.json())  // JSONとしてパース
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);  // 取得したデータが配列であれば状態にセット
        } else {
          console.error("Expected an array but got", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);  // 初回レンダリング時に1回だけ実行される

  return (
    <div className="App">
      <h1>Items from MongoDB</h1>
      <ul>
        {items.length === 0 ? (
          <li>No items found.</li>
        ) : (
          items.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))
        )}
      </ul>
    </div>
  );
}

export default IntroductionType;