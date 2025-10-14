from app import app
from models import db, User

def create_admin_user():
    with app.app_context():
        # Check if admin user already exists
        admin_user = User.query.filter_by(email='vkavin2006@gmail.com').first()
        
        if admin_user:
            print("Admin user already exists!")
            print(f"Email: {admin_user.email}")
            print(f"Admin status: {admin_user.is_admin}")
            return
        
        # Create admin user
        admin_email = 'vkavin2006@gmail.com'
        admin_password = 'Kavin2006@'
        admin_name = 'Admin Kavin'
        
        # Hash password using Flask-Bcrypt
        hashed_password = app.bcrypt.generate_password_hash(admin_password).decode('utf-8')
        
        # Create new admin user
        new_admin = User(
            name=admin_name,
            email=admin_email,
            password=hashed_password,
            verified=True,  # Admin is pre-verified
            is_admin=True
        )
        
        try:
            db.session.add(new_admin)
            db.session.commit()
            print("✅ Admin user created successfully!")
            print(f"Email: {admin_email}")
            print("Admin can now access the dashboard")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating admin user: {str(e)}")

if __name__ == '__main__':
    create_admin_user()