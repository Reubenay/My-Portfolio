
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy import text
from sqlalchemy.orm import Session
from database import get_db, init_db
from dotenv import load_dotenv
import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional

# Load environment variables
load_dotenv()

# --- FastAPI Setup ---
app = FastAPI(
    title="Reuben Mulero Portfolio Admin API",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT", "development") == "development" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT", "development") == "development" else None,
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    try:
        init_db()
    except Exception as e:
        print(f"Failed to initialize database: {e}")
        # Don't crash the app, just log the error

# Setup CORS
allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- JWT Configuration ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is required!")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # Default 24 hours
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Security Dependency ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
        return {"user_id": user_id}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise credentials_exception

# --- API Models ---
class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, example="admin")
    password: str = Field(..., min_length=6, example="Admin123")

class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=1000)

class SiteContentUpdate(BaseModel):
    section: str = Field(..., min_length=1, max_length=50)
    content: str = Field(..., min_length=1)

# --- Health Check ---
@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "service": "Portfolio API"}

# --- Public Routes ---
@app.get("/")
def home():
    return {"message": "Portfolio Admin API is running.", "version": "1.0.0"}

@app.post("/login")
def login(input: UserLogin, db: Session = Depends(get_db)):
    """Authenticate admin and return JWT token"""
    try:
        result = db.execute(
            text("SELECT id, username, password FROM users WHERE username = :username"),
            {"username": input.username}
        ).fetchone()
        
        if not result:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        stored_hash = result[2].encode("utf-8")
        if not bcrypt.checkpw(input.password.encode("utf-8"), stored_hash):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        token = create_access_token(data={"user_id": result[0], "username": result[1]})
        return {"auth": True, "token": token}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/contact")
def submit_contact_message(input: ContactMessage, db: Session = Depends(get_db)):
    """Submit a contact message"""
    try:
        db.execute(
            text("INSERT INTO messages (name, email, message) VALUES (:name, :email, :message)"),
            {"name": input.name, "email": input.email, "message": input.message}
        )
        db.commit()
        return {"message": "Message sent successfully!"}
    except Exception as e:
        db.rollback()
        print(f"Contact form error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message")

@app.get("/api/content")
def get_site_content(db: Session = Depends(get_db)):
    """Get all site content"""
    try:
        results = db.execute(
            text("SELECT section_name, content FROM site_content")
        ).mappings().all()
        return list(results)
    except Exception as e:
        print(f"Get content error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch content")

# --- Protected Routes ---
@app.get("/api/messages")
def get_all_messages(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all contact messages (admin only)"""
    try:
        results = db.execute(
            text("SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC")
        ).mappings().all()
        return [
            {
                "id": r["id"],
                "name": r["name"],
                "email": r["email"],
                "message": r["message"],
                "created_at": str(r["created_at"])
            }
            for r in results
        ]
    except Exception as e:
        print(f"Get messages error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages")

@app.post("/api/content/update")
def update_site_content(
    input: SiteContentUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update site content (admin only)"""
    try:
        result = db.execute(
            text("UPDATE site_content SET content = :content WHERE section_name = :section"),
            {"content": input.content, "section": input.section}
        )
        db.commit()
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail=f"Section '{input.section}' not found.")
        
        return {"message": f"Content for '{input.section}' updated successfully!"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Update content error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update content")

if __name__ == "__main__":
    print("Run using: uvicorn main:app --reload")