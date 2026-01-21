
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Build database URL from environment variables
DATABASE_URL = os.getenv(
    'DATABASE_URL',
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME')}"
)

# Create Engine with connection pooling and health checks
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Check connection health before using
    pool_recycle=3600,   # Recycle connections every hour
    connect_args={
        "connect_timeout": 10,
    }
)

# Create Session factory
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database (call this separately, not at import time!)
def init_db():
    import bcrypt
    db = SessionLocal()
    
    try:
        # Create USERS Table
        create_users_table = text("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
        """)
        db.execute(create_users_table)
        db.commit()
        print("✓ Users table created or verified.")

        # Seed Admin User if not exists
        check_users = text("SELECT COUNT(*) FROM users")
        user_count = db.execute(check_users).scalar()

        if user_count == 0:
            password = os.getenv('ADMIN_PASSWORD', 'Admin123')
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            seed_admin = text("""
                INSERT INTO users (username, password) VALUES 
                (:username, :password);
            """)
            db.execute(seed_admin, {"username": "admin", "password": hashed_password})
            db.commit()
            print("✓ Default Admin user seeded successfully!")
        else:
            print("✓ Users table already has data.")
        
        # Create MESSAGES Table
        create_messages_table = text("""
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        db.execute(create_messages_table)
        db.commit()
        print("✓ Messages table created or verified.")

        # Create SITE_CONTENT Table
        create_content_table = text("""
        CREATE TABLE IF NOT EXISTS site_content (
            section_name VARCHAR(50) PRIMARY KEY,
            content TEXT NOT NULL
        );
        """)
        db.execute(create_content_table)
        db.commit()
        print("✓ Site Content table created or verified.")

        # Seed Default 'About Me' Text
        check_content = text("SELECT COUNT(*) FROM site_content WHERE section_name = 'about_text'")
        content_count = db.execute(check_content).scalar()

        if content_count == 0:
            seed_content = text("""
                INSERT INTO site_content (section_name, content) VALUES 
                ('about_text', 'Artificial Intelligence development student at Publica AI and freelance AI developer in Nigeria.');
            """)
            db.execute(seed_content)
            db.commit()
            print("✓ Default Site Content seeded successfully!")
        else:
            print("✓ Site Content already exists.")
            
        print("\n✓ Database initialization complete!")
            
    except Exception as e:
        print(f"✗ Error initializing database: {e}")
        db.rollback()
        raise
    finally:
        db.close()