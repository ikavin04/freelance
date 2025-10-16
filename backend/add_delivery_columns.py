"""
Migration script to add delivery columns to applications table
Run this script once to add the new columns for final product delivery
"""

from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/freelance_db')

def add_delivery_columns():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            # Add delivery columns
            queries = [
                "ALTER TABLE applications ADD COLUMN IF NOT EXISTS delivery_file_url TEXT",
                "ALTER TABLE applications ADD COLUMN IF NOT EXISTS delivery_apk_url TEXT",
                "ALTER TABLE applications ADD COLUMN IF NOT EXISTS delivery_github_url TEXT",
                "ALTER TABLE applications ADD COLUMN IF NOT EXISTS delivery_deployed_url TEXT",
                "ALTER TABLE applications ADD COLUMN IF NOT EXISTS delivery_notes TEXT",
                "ALTER TABLE applications ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP"
            ]
            
            for query in queries:
                connection.execute(text(query))
                connection.commit()
                print(f"✓ Executed: {query}")
            
            print("\n✅ Successfully added all delivery columns!")
            print("\nNew columns added:")
            print("  - delivery_file_url (for video/image/pdf files)")
            print("  - delivery_apk_url (for APK files)")
            print("  - delivery_github_url (for GitHub links)")
            print("  - delivery_deployed_url (for deployed website links)")
            print("  - delivery_notes (for additional notes)")
            print("  - delivered_at (timestamp of delivery)")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            connection.rollback()

if __name__ == '__main__':
    print("Adding delivery columns to applications table...")
    print("=" * 60)
    add_delivery_columns()
