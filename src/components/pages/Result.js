import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import axios from 'axios';

export const Result = () => {
  const location = useLocation();
  const [result, setResult] = useState(null);  // 初期値をnullに設定
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // location.stateが変わるたびに結果をセット
  useEffect(() => {
    if (location.state) {
      setResult(location.state);
    } else {
      setStatus('No data found.');
    }
  }, [location.state]);

  const navigate =useNavigate();

  const goToSubmit = (result) =>{
    navigate("/",{state:result})
  };

  const Back = (event) =>{
    goToSubmit(result)
  };

  const handleSendEmail = async () => {
    if (!result) {
      setStatus('No data available to send email.');
      return;
    }

    const emailData = {
      name: result.name,
      mail: result.mail,
      body: result.comment,
    };

    setLoading(true);  // 送信処理開始
    setStatus('Sending email...');  // 送信中のメッセージを表示

    try {
      const response = await axios.post('http://127.0.0.1:8000/send-email/', emailData);
      console.log(response.data);  // レスポンスを確認
      setStatus('送信完了!/nご連絡をお待ちください');
    } catch (error) {
      setStatus(`Error sending email: ${error.response ? error.response.data : error.message}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);  // 送信後にローディング状態解除
    }
  };

  // resultがnullの場合、Loading...を表示
  if (result === null) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Box
        component="form"
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        noValidate
        autoComplete="off"
      >
        <h1>送信内容確認ページ</h1>
         {/* テーブル形式で出力 */}
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {/* 項目列の幅を小さく設定 */}
              <th style={{ width: '25%', border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>項目</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: '25%', border: '1px solid #ccc', padding: '8px' }}>氏名</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{result.name}</td>
            </tr>
            <tr>
              <td style={{ width: '25%', border: '1px solid #ccc', padding: '8px' }}>メールアドレス</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{result.mail}</td>
            </tr>
            <tr>
              <td style={{ width: '25%', border: '1px solid #ccc', padding: '8px' }}>お問い合わせ内容</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{result.comment}</td>
            </tr>
          </tbody>
        </table>
        <br/>

        <button 
          onClick={handleSendEmail} 
          disabled={loading}  // 送信中はボタン無効
        >
          {loading ? '送信中' : '送信'}
        </button>
        <button 
          onClick={Back}
          disabled={loading}  // 送信中はボタン無効
        >
          戻る
        </button>

        {status && <p style={{ color: status.includes('失敗') ? 'red' : 'green' }}>{status}</p>}
      </Box>
    </Container>
  );
};
