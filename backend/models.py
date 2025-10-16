from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    applications = db.relationship('Application', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'verified': self.verified,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }

class OTP(db.Model):
    __tablename__ = 'otps'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    service_type = db.Column(db.String(100), nullable=False)
    project_description = db.Column(db.Text, nullable=False)
    reference_images = db.Column(db.Text, nullable=True)
    days = db.Column(db.Integer, nullable=False)
    user_email = db.Column(db.String(150), db.ForeignKey('users.email'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Delivery fields for final product submission
    delivery_file_url = db.Column(db.Text, nullable=True)  # Uploaded file URL (video/image/pdf)
    delivery_apk_url = db.Column(db.Text, nullable=True)  # APK file for app development
    delivery_github_url = db.Column(db.Text, nullable=True)  # GitHub repository link
    delivery_deployed_url = db.Column(db.Text, nullable=True)  # Deployed website link
    delivery_notes = db.Column(db.Text, nullable=True)  # Additional delivery notes
    delivered_at = db.Column(db.DateTime, nullable=True)  # Timestamp of delivery
    
    def to_dict(self):
        return {
            'id': self.id,
            'client_name': self.client_name,
            'city': self.city,
            'service_type': self.service_type,
            'project_description': self.project_description,
            'reference_images': self.reference_images,
            'days': self.days,
            'user_email': self.user_email,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'delivery_file_url': self.delivery_file_url,
            'delivery_apk_url': self.delivery_apk_url,
            'delivery_github_url': self.delivery_github_url,
            'delivery_deployed_url': self.delivery_deployed_url,
            'delivery_notes': self.delivery_notes,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None
        }
