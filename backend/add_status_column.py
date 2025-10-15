from app import app
from models import db

def add_status_column():
    with app.app_context():
        try:
            # Add status column to applications table
            with db.engine.connect() as connection:
                connection.execute(db.text("ALTER TABLE applications ADD COLUMN status VARCHAR(20) DEFAULT 'pending';"))
                connection.commit()
            print("✅ Successfully added status column to applications table")
        except Exception as e:
            if 'already exists' in str(e) or 'duplicate column name' in str(e):
                print("ℹ️  status column already exists")
            else:
                print(f"❌ Error adding column: {str(e)}")

if __name__ == '__main__':
    add_status_column()