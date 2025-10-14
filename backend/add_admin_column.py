from app import app
from models import db

def add_admin_column():
    with app.app_context():
        try:
            # Add is_admin column to users table
            with db.engine.connect() as connection:
                connection.execute(db.text('ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;'))
                connection.commit()
            print("✅ Successfully added is_admin column to users table")
        except Exception as e:
            if 'already exists' in str(e) or 'duplicate column name' in str(e):
                print("ℹ️  is_admin column already exists")
            else:
                print(f"❌ Error adding column: {str(e)}")

if __name__ == '__main__':
    add_admin_column()