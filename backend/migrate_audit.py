"""
One-time migration: add audit_status column to pitches, create audit user.
Run once: py migrate_audit.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

import sqlite3
from auth import get_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), "launchinglaps.db")

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Add audit_status column if it doesn't exist
cur.execute("PRAGMA table_info(pitches)")
cols = [row[1] for row in cur.fetchall()]
if "audit_status" not in cols:
    cur.execute("ALTER TABLE pitches ADD COLUMN audit_status TEXT NOT NULL DEFAULT 'open'")
    print("Added audit_status column")
else:
    print("audit_status column already exists")

# Create audit user if not exists
cur.execute("SELECT id FROM users WHERE email = ?", ("audit@launchinglaps.com",))
if not cur.fetchone():
    hashed = get_password_hash("audit123")
    cur.execute(
        "INSERT INTO users (email, full_name, hashed_password, role, bio, is_active) VALUES (?,?,?,?,?,?)",
        ("audit@launchinglaps.com", "Audit Team", hashed, "audit", "LaunchingLaps internal audit team.", 1)
    )
    print("Created audit user: audit@launchinglaps.com / audit123")
else:
    print("Audit user already exists")

conn.commit()
conn.close()
print("Migration complete.")
