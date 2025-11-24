# from sqlalchemy import create_engine, text
# from sqlalchemy.orm import sessionmaker
# from dotenv import load_dotenv
# from pymysql.constants import CLIENT
# import os

# # Load environment variables
# load_dotenv()

# # Database Connection URL
# db_url = f"mysql+pymysql://{os.getenv('dbuser')}:{os.getenv('dbpassword')}@{os.getenv('dbhost')}:{os.getenv('dbport')}/{os.getenv('dbname')}"

# # Create Engine with Multi-Statement support
# engine = create_engine(
#     db_url,
#     connect_args={"client_flag": CLIENT.MULTI_STATEMENTS}
# )

# # Create Session
# session = sessionmaker(bind=engine)
# db = session()

# # ==========================================
# # 1. Create USERS Table (For Admin Login)
# # ==========================================
# create_users_table = text("""
# CREATE TABLE IF NOT EXISTS users (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     username VARCHAR(50) NOT NULL UNIQUE,
#     password VARCHAR(255) NOT NULL
# );
# """)

# db.execute(create_users_table)
# db.commit()
# print("Users table created or verified.")

# # --- Seed Admin User if not exists ---
# check_users = text("SELECT COUNT(*) FROM users")
# user_count = db.execute(check_users).scalar()

# if user_count == 0:
#     # CORRECT HASH for password: Admin123
#     seed_admin = text("""
#         INSERT INTO users (username, password) VALUES 
#         ('admin', '$2b$12$Z4eTtKzuKoU0Cq1kLjY7meQkS/qE1XE3h11M65SMUUfZoULt1YHsO');
#     """)
#     db.execute(seed_admin)
#     db.commit()
#     print("Default Admin user seeded successfully! Username: 'admin', Password: 'Admin123'")
# else:
#     print("Users table already has data — skipping seeding.")


# # ==========================================
# # 2. Create MESSAGES Table (For Contact Form)
# # ==========================================
# create_messages_table = text("""
# CREATE TABLE IF NOT EXISTS messages (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     name VARCHAR(100) NOT NULL,
#     email VARCHAR(100) NOT NULL,
#     message TEXT NOT NULL,
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );
# """)

# db.execute(create_messages_table)
# db.commit()
# print("Messages table created or verified.")


# # ==========================================
# # 3. Create SITE_CONTENT Table (For Editable Text)
# # ==========================================
# create_content_table = text("""
# CREATE TABLE IF NOT EXISTS site_content (
#     section_name VARCHAR(50) PRIMARY KEY,
#     content TEXT NOT NULL
# );
# """)

# db.execute(create_content_table)
# db.commit()
# print("Site Content table created or verified.")

# # --- Seed Default 'About Me' Text ---
# check_content = text("SELECT COUNT(*) FROM site_content WHERE section_name = 'about_text'")
# content_count = db.execute(check_content).scalar()

# if content_count == 0:
#     seed_content = text("""
#         INSERT INTO site_content (section_name, content) VALUES 
#         ('about_text', 'Artificial Intelligence development student at Publica AI and freelance AI developer in Nigeria.');
#     """)
#     db.execute(seed_content)
#     db.commit()
#     print("Default Site Content seeded successfully!")
# else:
#     print("Site Content already exists — skipping seeding.")


from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from pymysql.constants import CLIENT
import os
import bcrypt

# Load environment variables
load_dotenv()

# Database Connection URL
db_url = f"mysql+pymysql://{os.getenv('dbuser')}:{os.getenv('dbpassword')}@{os.getenv('dbhost')}:{os.getenv('dbport')}/{os.getenv('dbname')}"

# Create Engine with Multi-Statement support
engine = create_engine(
    db_url,
    connect_args={"client_flag": CLIENT.MULTI_STATEMENTS}
)

# Create Session
session = sessionmaker(bind=engine)
db = session()

# ==========================================
# 1. Create USERS Table (For Admin Login)
# ==========================================
create_users_table = text("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
""")
db.execute(create_users_table)
db.commit()
print("Users table created or verified.")

# --- Seed Admin User if not exists ---
check_users = text("SELECT COUNT(*) FROM users")
user_count = db.execute(check_users).scalar()

if user_count == 0:
    # Hash the default password "Admin123"
    password = "Admin123"
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    seed_admin = text(f"""
        INSERT INTO users (username, password) VALUES 
        ('admin', '{hashed_password}');
    """)
    db.execute(seed_admin)
    db.commit()
    print("Default Admin user seeded successfully! Username: 'admin', Password: 'Admin123'")
else:
    print("Users table already has data — skipping seeding.")

# ==========================================
# 2. Create MESSAGES Table (For Contact Form)
# ==========================================
create_messages_table = text("""
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")
db.execute(create_messages_table)
db.commit()
print("Messages table created or verified.")

# ==========================================
# 3. Create SITE_CONTENT Table (For Editable Text)
# ==========================================
create_content_table = text("""
CREATE TABLE IF NOT EXISTS site_content (
    section_name VARCHAR(50) PRIMARY KEY,
    content TEXT NOT NULL
);
""")
db.execute(create_content_table)
db.commit()
print("Site Content table created or verified.")

# --- Seed Default 'About Me' Text ---
check_content = text("SELECT COUNT(*) FROM site_content WHERE section_name = 'about_text'")
content_count = db.execute(check_content).scalar()

if content_count == 0:
    seed_content = text("""
        INSERT INTO site_content (section_name, content) VALUES 
        ('about_text', 'Artificial Intelligence development student at Publica AI and freelance AI developer in Nigeria.');
    """)
    db.execute(seed_content)
    db.commit()
    print("Default Site Content seeded successfully!")
else:
    print("Site Content already exists — skipping seeding.")
