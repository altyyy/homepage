import React ,{ useEffect, useState }from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Container,Box } from '@mui/material';
import { TextField } from '@mui/material';

const Form = () => {
  const location = useLocation()


  const [form,setForm] = useState({
    name:location.state === null ? "":location.state.name,
    mail:location.state === null ? "":location.state.mail,
    comment:location.state === null ? "お問合せ内容をご記入ください":location.state.comment
  });

     // location.stateが変わるたびに結果をセット
     useEffect(() => {
      if (location.state) {
        setForm(location.state);
      } else {
        console.log('No data found.');
      }
    }, [location.state]);


const [error, setError] = useState(''); // エラーメッセージ
const [isFormValid, setIsFormValid] = useState(true); // フォームが有効かどうか

const validateEmail = (email) => {
  // 正規表現を使ってメールアドレスをチェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

  const handleInputChange = (event) =>{
    const { name,value} = event.target;
    setForm({...form,[name]:value})

   // メールアドレスのバリデーション
    if (name === 'mail') {
    if (validateEmail(value)) {
      setError('');
      setIsFormValid(true);
    } else {
      setError('正しいメールアドレスを入力してください');
      setIsFormValid(false);
    }
  }
  };

  const navigate = useNavigate();

  const goToResult= (form) =>{
  navigate("/result",{state:form});
  };

  const handleFocus = () => {
    if (form.comment=== 'お問合せ内容をご記入ください') {
      setForm({...form,comment:''});  // 初期値が表示されている時にクリックで消す
    }
  };

  const handleBlur = () => {
    if (form.comment === '') {
      setForm({...form,comment:'お問合せ内容をご記入ください'});  // 何も入力しなかった場合に再表示
    }
  };

  const handleSubmit = (event)=>{
    goToResult(form)
  };


  return (
    <Container >
    <Box
    component="form"
    sx={{
      marginTop:1,
      display:"flex",
      flexDirection:'column',
      alignItems:"center",
    }}
    noValidate
    autoComplete="off"
    >
      <div class = "title">
        <h1>佐藤有都</h1>
      </div>
      <div>
      <h2>お問い合わせフォーム</h2>
      </div>

      <TextField
      id="name"
      label="氏名"
      variant="outlined"
      onChange={handleInputChange}
      value={form.name}
      name="name"
      fullWidth
      />

      <br/>
      <TextField
          id="name"
          label="メールアドレス"
          variant="outlined"
          onChange={handleInputChange}
          value={form.mail}
          name="mail"
          fullWidth
          error={!!error} // エラーがある場合、TextField を赤く表示
          helperText={error} // エラーメッセージを表示
        />

      <br/>
      <TextField
          id="comment"
          label="お問い合わせ内容"
          multiline
          onChange={handleInputChange}
          value={form.comment}
          name="comment"
          fullWidth
          rows={4}
          onFocus={handleFocus}  // フォーカスされたとき
          onBlur={handleBlur}  // フォーカスが外れたとき
        />

        <br/>


    <button
    onClick={handleSubmit}
    disabled={!isFormValid} // フォームが有効でない場合、ボタンを無効化
    >確認へ</button>

    </Box>
  </Container>
  

  );
};

export default Form;