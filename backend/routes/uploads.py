from flask import Blueprint, request, jsonify, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from models import User

uploads_bp = Blueprint('uploads', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {
    'video': {'mp4', 'mov', 'avi', 'mkv', 'webm'},
    'image': {'png', 'jpg', 'jpeg', 'gif', 'webp'},
    'document': {'pdf', 'doc', 'docx', 'psd', 'ai'},
    'archive': {'zip', 'rar', '7z'},
    'apk': {'apk'}
}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename, file_type=None):
    """Check if file extension is allowed"""
    if '.' not in filename:
        return False
    
    ext = filename.rsplit('.', 1)[1].lower()
    
    if file_type:
        return ext in ALLOWED_EXTENSIONS.get(file_type, set())
    else:
        # Allow any extension from any category
        all_extensions = set()
        for extensions in ALLOWED_EXTENSIONS.values():
            all_extensions.update(extensions)
        return ext in all_extensions

def get_file_type(filename):
    """Determine file type category"""
    ext = filename.rsplit('.', 1)[1].lower()
    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return file_type
    return 'other'

@uploads_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    """Upload a file for delivery"""
    try:
        current_user_email = get_jwt_identity()
        
        # Check if user is admin
        user = User.query.filter_by(email=current_user_email).first()
        if not user or not user.is_admin:
            return jsonify({'message': 'Admin access required'}), 403
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'message': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'message': 'File type not allowed'}), 400
        
        # Create secure filename with timestamp to avoid conflicts
        original_filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{original_filename}"
        
        # Determine file type and create subfolder
        file_type = get_file_type(original_filename)
        type_folder = os.path.join(UPLOAD_FOLDER, file_type)
        os.makedirs(type_folder, exist_ok=True)
        
        # Save file
        filepath = os.path.join(type_folder, filename)
        file.save(filepath)
        
        # Get file size
        file_size = os.path.getsize(filepath)
        
        # Create download URL
        download_url = f"{request.host_url}api/uploads/{file_type}/{filename}"
        
        return jsonify({
            'message': 'File uploaded successfully',
            'url': download_url,
            'filename': original_filename,
            'size': file_size,
            'type': file_type
        }), 200
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({'message': f'Failed to upload file: {str(e)}'}), 500

@uploads_bp.route('/uploads/<file_type>/<filename>', methods=['GET'])
def download_file(file_type, filename):
    """Download/serve uploaded files"""
    try:
        type_folder = os.path.join(UPLOAD_FOLDER, file_type)
        return send_from_directory(type_folder, filename, as_attachment=True)
    except Exception as e:
        return jsonify({'message': 'File not found'}), 404

@uploads_bp.route('/uploads/list', methods=['GET'])
@jwt_required()
def list_uploads():
    """List all uploaded files (admin only)"""
    try:
        current_user_email = get_jwt_identity()
        
        # Check if user is admin
        user = User.query.filter_by(email=current_user_email).first()
        if not user or not user.is_admin:
            return jsonify({'message': 'Admin access required'}), 403
        
        files = []
        for file_type in ALLOWED_EXTENSIONS.keys():
            type_folder = os.path.join(UPLOAD_FOLDER, file_type)
            if os.path.exists(type_folder):
                for filename in os.listdir(type_folder):
                    filepath = os.path.join(type_folder, filename)
                    files.append({
                        'filename': filename,
                        'type': file_type,
                        'size': os.path.getsize(filepath),
                        'url': f"{request.host_url}api/uploads/{file_type}/{filename}"
                    })
        
        return jsonify({'files': files, 'total': len(files)}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to list files: {str(e)}'}), 500
