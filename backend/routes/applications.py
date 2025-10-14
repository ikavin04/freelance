from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Application, User

applications_bp = Blueprint('applications', __name__)

@applications_bp.route('/apply', methods=['POST'])
@jwt_required()
def submit_application():
    """Submit a new project application"""
    try:
        # Get current user email from JWT
        current_user_email = get_jwt_identity()
        
        # Verify user exists and is verified
        user = User.query.filter_by(email=current_user_email).first()
        if not user or not user.verified:
            return jsonify({'message': 'Unauthorized'}), 401
        
        data = request.get_json()
        
        # Validate required fields
        client_name = data.get('client_name', '').strip()
        city = data.get('city', '').strip()
        service_type = data.get('service_type', '').strip()
        days = data.get('days')
        
        if not all([client_name, city, service_type, days]):
            return jsonify({'message': 'All fields are required'}), 400
        
        # Validate service type
        valid_services = ['Video Editing', 'Poster Design', 'Website Creation', 'App Development']
        if service_type not in valid_services:
            return jsonify({'message': 'Invalid service type'}), 400
        
        # Validate days (must be at least 3)
        try:
            days = int(days)
            if days < 3:
                return jsonify({'message': 'Minimum 3 days required to complete the project'}), 400
        except ValueError:
            return jsonify({'message': 'Days must be a valid number'}), 400
        
        # Create new application
        new_application = Application(
            client_name=client_name,
            city=city,
            service_type=service_type,
            days=days,
            user_email=current_user_email
        )
        
        db.session.add(new_application)
        db.session.commit()
        
        return jsonify({
            'message': 'Your request has been submitted successfully! 🎉',
            'application': new_application.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to submit application: {str(e)}'}), 500

@applications_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_applications():
    """Get all applications (admin route or user's own applications)"""
    try:
        current_user_email = get_jwt_identity()
        
        # Get user's own applications
        applications = Application.query.filter_by(user_email=current_user_email).order_by(Application.created_at.desc()).all()
        
        return jsonify({
            'applications': [app.to_dict() for app in applications],
            'total': len(applications)
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to retrieve applications: {str(e)}'}), 500

@applications_bp.route('/applications/all', methods=['GET'])
@jwt_required()
def get_all_applications():
    """Get all applications (admin only)"""
    try:
        current_user_email = get_jwt_identity()
        
        # Check if user is admin
        user = User.query.filter_by(email=current_user_email).first()
        if not user or not user.is_admin:
            return jsonify({'message': 'Admin access required'}), 403
        
        applications = Application.query.order_by(Application.created_at.desc()).all()
        
        return jsonify({
            'applications': [app.to_dict() for app in applications],
            'total': len(applications)
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to retrieve applications: {str(e)}'}), 500
