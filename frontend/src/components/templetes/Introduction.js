import React, { useEffect, useState } from 'react';

function Introduction() {
  const [items, setItems] = useState([]);  // データを保存するための状態

  useEffect(() => {
    // FastAPIサーバーからデータを取得
    fetch('http://localhost:8000/items/')
      .then((response) => response.json())  // JSONとしてパース
      .then((data) => {
        setItems(data);  // 取得したデータを状態にセット
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);  // 初回レンダリング時に1回だけ実行される

  return (
    <div className="App">
      <h1>Items from MongoDB</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.type_code} </li>
        ))}
      </ul>
    </div>
  );
}

export default Introduction;
