from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 環境変数を読み込む
load_dotenv()

# メールの設定
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL")

# FastAPIのインスタンス
app = FastAPI()
# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可 (セキュリティ上、必要に応じて制限する)
    allow_credentials=True,
    allow_methods=["*"],  # すべてのメソッドを許可
    allow_headers=["*"],  # すべてのヘッダを許可
)

class MailRequest(BaseModel):
    name: str
    body: str
    mail: str

def send_email(name: str, mail: str ,body: str):
    try:
        # メールの設定
        message = MIMEMultipart()
        message["From"] = SENDER_EMAIL
        message["To"] = RECIPIENT_EMAIL
        message["Subject"] = name
        msg = f"mail: {mail}\n\n問い合わせ内容:\n{body}"
        
        # メールの本文を追加
        message.attach(MIMEText(msg, "plain"))
        
        # SMTPサーバーへの接続
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # TLSで接続
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            text = message.as_string()
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        logging.error(f"Error sending email: {e}")
        print("Error:", e)

@app.post("/send-email/")
async def send_email_api(mail_request: MailRequest):
    send_email(mail_request.name, mail_request.mail,mail_request.body)
    print(f"Received mail_request: {mail_request}")
    #return {"message": "Email sent successfully"}