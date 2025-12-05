from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
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
        project_description = data.get('project_description', '').strip()
        reference_images = data.get('reference_images', '').strip()
        days = data.get('days')
        
        if not all([client_name, city, service_type, project_description, days]):
            return jsonify({'message': 'All required fields must be filled'}), 400
        
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
        
        # Validate project description word count (max 10,000 words)
        word_count = len(project_description.split())
        if word_count > 10000:
            return jsonify({'message': 'Project description cannot exceed 10,000 words'}), 400
        
        # Create new application
        new_application = Application(
            client_name=client_name,
            city=city,
            service_type=service_type,
            project_description=project_description,
            reference_images=reference_images if reference_images else None,
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

@applications_bp.route('/applications/<int:app_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(app_id):
    """Update application status (admin only) and send email notification"""
    try:
        current_user_email = get_jwt_identity()
        
        # Check if user is admin
        user = User.query.filter_by(email=current_user_email).first()
        if not user or not user.is_admin:
            return jsonify({'message': 'Admin access required'}), 403
        
        data = request.get_json()
        new_status = data.get('status', '').strip().lower()
        
        # Validate status
        valid_statuses = ['pending', 'accepted', 'rejected', 'completed']
        if new_status not in valid_statuses:
            return jsonify({'message': 'Invalid status'}), 400
        
        # Find application
        application = Application.query.get(app_id)
        if not application:
            return jsonify({'message': 'Application not found'}), 404
        
        # Update status
        old_status = getattr(application, 'status', 'pending')
        application.status = new_status
        db.session.commit()
        
        # Send email notification if status changed to accepted or rejected
        if new_status in ['accepted', 'rejected'] and old_status != new_status:
            try:
                send_status_notification_email(application, new_status)
            except Exception as email_error:
                print(f"Failed to send email: {str(email_error)}")
                # Don't fail the request if email fails
        
        return jsonify({
            'message': f'Application {new_status} successfully',
            'application': application.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update application: {str(e)}'}), 500

@applications_bp.route('/applications/<int:app_id>/deliver', methods=['PUT'])
@jwt_required()
def deliver_final_product(app_id):
    """Submit final product delivery (admin only) and send email notification"""
    try:
        current_user_email = get_jwt_identity()
        
        # Check if user is admin
        user = User.query.filter_by(email=current_user_email).first()
        if not user or not user.is_admin:
            return jsonify({'message': 'Admin access required'}), 403
        
        data = request.get_json()
        
        # Find application
        application = Application.query.get(app_id)
        if not application:
            return jsonify({'message': 'Application not found'}), 404
        
        # Update delivery fields based on service type
        from datetime import datetime
        
        application.delivery_file_url = data.get('delivery_file_url', '').strip() or None
        application.delivery_apk_url = data.get('delivery_apk_url', '').strip() or None
        application.delivery_github_url = data.get('delivery_github_url', '').strip() or None
        application.delivery_deployed_url = data.get('delivery_deployed_url', '').strip() or None
        application.delivery_notes = data.get('delivery_notes', '').strip() or None
        application.delivered_at = datetime.utcnow()
        application.status = 'completed'
        
        db.session.commit()
        
        # Send delivery notification email
        try:
            send_delivery_notification_email(application)
        except Exception as email_error:
            print(f"Failed to send delivery email: {str(email_error)}")
            # Don't fail the request if email fails
        
        return jsonify({
            'message': 'Final product delivered successfully and client notified!',
            'application': application.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to deliver product: {str(e)}'}), 500

def send_delivery_notification_email(application):
    """Send email notification to client about final product delivery"""
    try:
        service_type = application.service_type
        
        # Build delivery links HTML
        delivery_links = []
        
        if application.delivery_file_url:
            delivery_links.append(f'''
                <div style="margin: 10px 0;">
                    <strong> Final Files:</strong><br>
                    <a href="{application.delivery_file_url}" style="color: #667eea; text-decoration: none;">
                        Download Files →
                    </a>
                </div>
            ''')
        
        if application.delivery_apk_url:
            delivery_links.append(f'''
                <div style="margin: 10px 0;">
                    <strong> APK File:</strong><br>
                    <a href="{application.delivery_apk_url}" style="color: #667eea; text-decoration: none;">
                        Download APK →
                    </a>
                </div>
            ''')
        
        if application.delivery_github_url:
            delivery_links.append(f'''
                <div style="margin: 10px 0;">
                    <strong>GitHub Repository:</strong><br>
                    <a href="{application.delivery_github_url}" style="color: #667eea; text-decoration: none;">
                        View on GitHub →
                    </a>
                </div>
            ''')
        
        if application.delivery_deployed_url:
            delivery_links.append(f'''
                <div style="margin: 10px 0;">
                    <strong>Live Website:</strong><br>
                    <a href="{application.delivery_deployed_url}" style="color: #667eea; text-decoration: none;">
                        Visit Website →
                    </a>
                </div>
            ''')
        
        delivery_section = ''.join(delivery_links) if delivery_links else '<p style="color: #888;">No delivery files attached.</p>'
        
        notes_section = ''
        if application.delivery_notes:
            notes_section = f'''
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">Delivery Notes:</h3>
                    <p style="margin: 0; color: #666; white-space: pre-wrap;">{application.delivery_notes}</p>
                </div>
            '''
        
        subject = f" Your {service_type} Project is Complete!"
        
        template = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Project Completed! 🎉</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your final product is ready</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #333;">Hello {application.client_name}!</h2>
                
                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                    Great news! Your <strong>{service_type}</strong> project has been completed and is ready for delivery. 
                    Thank you for your patience and collaboration throughout the project.
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="margin: 0 0 15px 0; color: #333;"> Delivery Package:</h3>
                    {delivery_section}
                </div>
                
                {notes_section}
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">Project Summary:</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Service:</strong> {application.service_type}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> {application.city}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Duration:</strong> {application.days} days</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Application ID:</strong> #{application.id}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Delivered:</strong> {application.delivered_at.strftime('%B %d, %Y at %I:%M %p')}</p>
                </div>
                
                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                    Please review the deliverables and let me know if you have any questions or need any modifications. 
                    Your feedback is valuable and helps me improve my services.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3001/my-applications" 
                       style="background: #28a745; color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                        View in Dashboard
                    </a>
                </div>
                
                <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #0066cc; font-size: 14px;">
                          <strong>Need Support?</strong> If you encounter any issues or have questions, 
                        please don't hesitate to reach out. I'm here to help!
                    </p>
                </div>
                
                <p style="color: #888; font-size: 14px; margin-top: 30px;">
                    Thank you for choosing our services!<br>
                    <strong>Creo Studios Team</strong><br>
                    Building your ideas into reality
                </p>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    © 2025 Creo Studios. All rights reserved.
                </p>
            </div>
        </div>
        """
        
        # Create and send email
        msg = Message(
            subject=subject,
            recipients=[application.user_email],
            html=template,
            sender=current_app.config['MAIL_USERNAME']
        )
        
        current_app.extensions['mail'].send(msg)
        print(f"Delivery notification email sent to {application.user_email}")
        
    except Exception as e:
        print(f"Failed to send delivery email: {str(e)}")
        raise e

def send_status_notification_email(application, status):
    """Send email notification to client about application status"""
    try:
        if status == 'accepted':
            subject = f"Your {application.service_type} Project Has Been Accepted!"
            template = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Great News!</h1>
                </div>
                
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #333;">Hello {application.client_name}!</h2>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        We're excited to inform you that your <strong>{application.service_type}</strong> project has been <strong style="color: #28a745;">ACCEPTED</strong>!
                    </p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                        <h3 style="margin: 0 0 15px 0; color: #333;">Project Details:</h3>
                        <p style="margin: 5px 0; color: #666;"><strong>Service:</strong> {application.service_type}</p>
                        <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> {application.city}</p>
                        <p style="margin: 5px 0; color: #666;"><strong>Duration:</strong> {application.days} days</p>
                        <p style="margin: 5px 0; color: #666;"><strong>Application ID:</strong> #{application.id}</p>
                    </div>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        I'll be reaching out to you soon to discuss the project details and timeline. 
                        You can track your project progress in your dashboard.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3001/my-applications" 
                           style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                            View My Applications
                        </a>
                    </div>
                    
                    <p style="color: #888; font-size: 14px;">
                        Best regards,<br>
                        <strong>Creo Studios Team</strong>
                    </p>
                </div>
            </div>
            """
        
        elif status == 'rejected':
            subject = f"Update on Your {application.service_type} Project Application"
            template = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Application Update</h1>
                </div>
                
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #333;">Hello {application.client_name},</h2>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Thank you for your interest in my <strong>{application.service_type}</strong> services. 
                        After careful consideration, I'm unable to take on this project at the moment.
                    </p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <h3 style="margin: 0 0 15px 0; color: #333;">Application Details:</h3>
                        <p style="margin: 5px 0; color: #666;"><strong>Service:</strong> {application.service_type}</p>
                        <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> {application.city}</p>
                        <p style="margin: 5px 0; color: #666;"><strong>Duration:</strong> {application.days} days</p>
                        <p style="margin: 5px 0; color: #666;"><strong>Application ID:</strong> #{application.id}</p>
                    </div>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        This could be due to current workload, project requirements, or timeline constraints. 
                        Please feel free to apply again in the future or reach out for alternative solutions.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3001/apply" 
                           style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                            Submit New Application
                        </a>
                    </div>
                    
                    <p style="color: #888; font-size: 14px;">
                        Thank you for your understanding,<br>
                        <strong>Creo Studios Team</strong>
                    </p>
                </div>
            </div>
            """
        
        else:
            return  # Don't send email for other statuses
        
        # Create and send email
        msg = Message(
            subject=subject,
            recipients=[application.user_email],
            html=template,
            sender=current_app.config['MAIL_USERNAME']
        )
        
        current_app.extensions['mail'].send(msg)
        print(f"Status notification email sent to {application.user_email}")
        
    except Exception as e:
        print(f"Failed to send email notification: {str(e)}")
        raise e
