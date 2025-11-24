# from fastapi import FastAPI, HTTPException, Depends
# from fastapi.security import OAuth2PasswordBearer
# from pydantic import BaseModel, Field
# from dotenv import load_dotenv
# from sqlalchemy import text
# from database import db
# from fastapi.middleware.cors import CORSMiddleware
# import os
# import bcrypt
# import jwt
# from datetime import datetime, timedelta

# # Load environment variables
# load_dotenv()

# app = FastAPI(title="Reuben Mulero Portfolio Admin API", version="1.0.0")

# # CORS
# origins = [
#     "http://localhost:5173",
#     os.getenv("FRONTEND_URL")
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

# # JWT Config
# SECRET_KEY = os.getenv("SECRET_KEY", "defaultsecretkey")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# def create_access_token(data: dict, expires_delta: timedelta | None = None):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id: int = payload.get("user_id")
#         if user_id is None:
#             raise HTTPException(status_code=401, detail="Invalid authentication credentials")
#     except jwt.PyJWTError:
#         raise HTTPException(status_code=401, detail="Invalid authentication credentials")
#     return {"user_id": user_id}

# # --- Models ---
# class UserLogin(BaseModel):
#     username: str
#     password: str

# # --- Routes ---
# @app.get("/")
# def home():
#     return {"message": "Portfolio Admin API is running."}

# @app.post("/login")
# def login(input: UserLogin):
#     """Login admin and return JWT token."""
#     # 1. Check if username exists
#     query = text("SELECT id, username, password FROM users WHERE username = :username")
#     result = db.execute(query, {"username": input.username}).fetchone()

#     if not result:
#         raise HTTPException(status_code=401, detail="Invalid username or password")

#     user_id, username, stored_hash = result

#     # 2. Verify password with bcrypt
#     if not bcrypt.checkpw(input.password.encode("utf-8"), stored_hash.encode("utf-8")):
#         raise HTTPException(status_code=401, detail="Invalid username or password")

#     # 3. Create JWT token
#     token = create_access_token({"user_id": user_id, "username": username})
#     return {"auth": True, "token": token}







from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from sqlalchemy import text
from database import db
from fastapi.middleware.cors import CORSMiddleware
import os
import bcrypt
import jwt
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# --- FastAPI Setup ---
app = FastAPI(title="Reuben Mulero Portfolio Admin API", version="1.0.0")

# Setup CORS
origins = [
    "http://localhost:5173",
    os.getenv('FRONTEND_URL')
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- JWT Configuration ---
SECRET_KEY = os.getenv("SECRET_KEY", "your-default-jwt-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Security Dependency ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return {"user_id": user_id}

# --- API Models ---
class UserLogin(BaseModel):
    username: str = Field(..., example="admin")
    password: str = Field(..., example="Admin123")

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str

class SiteContentUpdate(BaseModel):
    section: str
    content: str

# --- Public Routes ---
@app.get("/")
def home():
    return {"message": "Portfolio Admin API is running."}

@app.post("/login")
def login(input: UserLogin):
    """Authenticate admin and return JWT token"""
    result = db.execute(text("SELECT id, username, password FROM users WHERE username = :username"), {"username": input.username}).fetchone()
    if not result:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    stored_hash = result[2].encode("utf-8")
    if not bcrypt.checkpw(input.password.encode("utf-8"), stored_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(data={"user_id": result[0], "username": result[1]})
    return {"auth": True, "token": token}

@app.post("/api/contact")
def submit_contact_message(input: ContactMessage):
    db.execute(text("INSERT INTO messages (name, email, message) VALUES (:name, :email, :message)"), input.dict())
    db.commit()
    return {"message": "Message sent successfully!"}

@app.get("/api/content")
def get_site_content():
    results = db.execute(text("SELECT section_name, content FROM site_content")).mappings().all()
    return results

# --- Protected Routes ---
@app.get("/api/messages")
def get_all_messages(current_user: dict = Depends(get_current_user)):
    results = db.execute(text("SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC")).mappings().all()
    return [{"id": r["id"], "name": r["name"], "email": r["email"], "message": r["message"], "created_at": str(r["created_at"])} for r in results]

@app.post("/api/content/update")
def update_site_content(input: SiteContentUpdate, current_user: dict = Depends(get_current_user)):
    result = db.execute(text("UPDATE site_content SET content = :content WHERE section_name = :section"), {"content": input.content, "section": input.section})
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail=f"Section '{input.section}' not found.")
    return {"message": f"Content for '{input.section}' updated successfully!"}

if __name__ == "__main__":
    print("Run using: uvicorn main:app --reload")
