from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from flask_mail import Message
from models import db, User, OTP
from datetime import datetime, timedelta
import random
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password_strength(password):
    """Validate password complexity requirements"""
    if len(password) < 8:
        return False, 'Password must be at least 8 characters long'
    
    if not re.search(r'[A-Z]', password):
        return False, 'Password must contain at least one uppercase letter'
    
    if not re.search(r'[a-z]', password):
        return False, 'Password must contain at least one lowercase letter'
    
    if not re.search(r'\d', password):
        return False, 'Password must contain at least one number'
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    
    return True, 'Password is strong'

def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    """Send OTP via email"""
    try:
        msg = Message(
            subject='Your OTP for Creo Studios',
            recipients=[email],
            html=f"""
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h1 style="color: #7c3aed; text-align: center;">Creo Studios</h1>
                        <h2 style="color: #333;">Email Verification</h2>
                        <p style="color: #555; font-size: 16px;">Hello!</p>
                        <p style="color: #555; font-size: 16px;">Thank you for registering with Creo Studios. Your One-Time Password (OTP) is:</p>
                        <div style="background-color: #7c3aed; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
                            {otp}
                        </div>
                        <p style="color: #555; font-size: 14px;">This OTP is valid for 5 minutes.</p>
                        <p style="color: #555; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="color: #888; font-size: 12px; text-align: center;">© 2025 Creo Studios. Built with ❤️</p>
                    </div>
                </body>
            </html>
            """
        )
        current_app.mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user and send OTP"""
    try:
        data = request.get_json()
        
        # Validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        
        if not all([name, email, password, confirm_password]):
            return jsonify({'message': 'All fields are required'}), 400
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'message': 'Invalid email format'}), 400
        
        # Check password match
        if password != confirm_password:
            return jsonify({'message': 'Passwords do not match'}), 400
        
        # Check password strength with complexity rules
        is_strong, strength_message = validate_password_strength(password)
        if not is_strong:
            return jsonify({'message': strength_message}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'message': 'Email already registered'}), 400
        
        # Hash password
        hashed_password = current_app.bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Create new user (not verified yet)
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            verified=False
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate and save OTP
        otp = generate_otp()
        new_otp = OTP(email=email, otp=otp)
        
        # Delete old OTPs for this email
        OTP.query.filter_by(email=email).delete()
        
        db.session.add(new_otp)
        db.session.commit()
        
        # Send OTP email
        if send_otp_email(email, otp):
            return jsonify({
                'message': 'Registration successful! OTP sent to your email.',
                'email': email
            }), 201
        else:
            return jsonify({'message': 'Registration successful but failed to send OTP. Please try again.'}), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP and activate user account"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        otp_input = data.get('otp', '').strip()
        
        if not email or not otp_input:
            return jsonify({'message': 'Email and OTP are required'}), 400
        
        # Find the most recent OTP for this email
        otp_record = OTP.query.filter_by(email=email).order_by(OTP.created_at.desc()).first()
        
        if not otp_record:
            return jsonify({'message': 'No OTP found for this email'}), 404
        
        # Check if OTP is expired (5 minutes)
        expiry_time = otp_record.created_at + timedelta(minutes=current_app.config['OTP_EXPIRY_MINUTES'])
        if datetime.utcnow() > expiry_time:
            return jsonify({'message': 'OTP has expired. Please request a new one.'}), 400
        
        # Verify OTP
        if otp_record.otp != otp_input:
            return jsonify({'message': 'Invalid OTP'}), 400
        
        # Mark user as verified
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user.verified = True
        
        # Delete used OTP
        db.session.delete(otp_record)
        db.session.commit()
        
        return jsonify({'message': 'Email verified successfully! You can now log in.'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Verification failed: {str(e)}'}), 500

@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    """Resend OTP to user email"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'message': 'Email is required'}), 400
        
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user.verified:
            return jsonify({'message': 'Email already verified'}), 400
        
        # Generate new OTP
        otp = generate_otp()
        
        # Delete old OTPs
        OTP.query.filter_by(email=email).delete()
        
        # Save new OTP
        new_otp = OTP(email=email, otp=otp)
        db.session.add(new_otp)
        db.session.commit()
        
        # Send OTP email
        if send_otp_email(email, otp):
            return jsonify({'message': 'OTP resent successfully!'}), 200
        else:
            return jsonify({'message': 'Failed to send OTP. Please try again.'}), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to resend OTP: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        # User not found - show generic error for security
        if not user:
            return jsonify({'message': 'Invalid credentials. Please check your email and password or register if you are new.'}), 401
        
        # Check if user is verified
        if not user.verified:
            return jsonify({'message': 'Please verify your email before logging in. Check your inbox for the OTP.'}), 401
        
        # Check password
        if not current_app.bcrypt.check_password_hash(user.password, password):
            return jsonify({'message': 'Invalid credentials. Please check your email and password.'}), 401
        
        # Generate JWT tokens (access + refresh)
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        
        return jsonify({
            'message': 'Login successful!',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/admin-login', methods=['POST'])
def admin_login():
    """Admin login with predefined credentials"""
    try:
        # Predefined admin credentials
        admin_email = 'vkavin2006@gmail.com'
        admin_password = 'Kavin2006@'
        
        # Find admin user
        user = User.query.filter_by(email=admin_email, is_admin=True).first()
        
        if not user:
            return jsonify({'message': 'Admin user not found'}), 401
        
        # Verify password using bcrypt directly
        if not current_app.bcrypt.check_password_hash(user.password, admin_password):
            return jsonify({'message': 'Invalid admin credentials'}), 401
        
        # Create JWT tokens (access + refresh)
        access_token = create_access_token(identity=admin_email)
        refresh_token = create_refresh_token(identity=admin_email)
        
        return jsonify({
            'message': 'Admin login successful!',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Admin login failed: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user details"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to get user: {str(e)}'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    try:
        current_user_email = get_jwt_identity()
        
        # Verify user still exists
        user = User.query.filter_by(email=current_user_email).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Create new access token
        new_access_token = create_access_token(identity=current_user_email)
        
        return jsonify({
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Token refresh failed: {str(e)}'}), 500
