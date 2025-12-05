from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from datetime import datetime
from io import BytesIO
from models import db, User, UploadedFile

uploads_bp = Blueprint('uploads', __name__)

ALLOWED_EXTENSIONS = {
    'video': {'mp4', 'mov', 'avi', 'mkv', 'webm'},
    'image': {'png', 'jpg', 'jpeg', 'gif', 'webp'},
    'document': {'pdf', 'doc', 'docx', 'psd', 'ai'},
    'archive': {'zip', 'rar', '7z'},
    'apk': {'apk'}
}

MIME_TYPES = {
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'webm': 'video/webm',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'psd': 'image/vnd.adobe.photoshop',
    'ai': 'application/postscript',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'apk': 'application/vnd.android.package-archive'
}

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

def get_mime_type(filename):
    """Get MIME type from filename"""
    ext = filename.rsplit('.', 1)[1].lower()
    return MIME_TYPES.get(ext, 'application/octet-stream')

@uploads_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    """Upload a file for delivery - stored in PostgreSQL"""
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
        
        # Determine file type
        file_type = get_file_type(original_filename)
        mime_type = get_mime_type(original_filename)
        
        # Read file data into memory
        file_data = file.read()
        file_size = len(file_data)
        
        # Create database record
        uploaded_file = UploadedFile(
            filename=filename,
            original_filename=original_filename,
            file_type=file_type,
            mime_type=mime_type,
            file_data=file_data,
            file_size=file_size,
            uploaded_by=current_user_email
        )
        
        db.session.add(uploaded_file)
        db.session.commit()
        
        # Create download URL using file ID
        download_url = f"{request.host_url}api/uploads/{uploaded_file.id}"
        
        return jsonify({
            'message': 'File uploaded successfully',
            'url': download_url,
            'filename': original_filename,
            'size': file_size,
            'type': file_type,
            'id': uploaded_file.id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Upload error: {str(e)}")
        return jsonify({'message': f'Failed to upload file: {str(e)}'}), 500

@uploads_bp.route('/uploads/<int:file_id>', methods=['GET'])
def download_file(file_id):
    """Download/serve uploaded files from PostgreSQL"""
    try:
        # Retrieve file from database
        uploaded_file = UploadedFile.query.get(file_id)
        
        if not uploaded_file:
            return jsonify({'message': 'File not found'}), 404
        
        # Create BytesIO object from binary data
        file_stream = BytesIO(uploaded_file.file_data)
        
        # Send file with proper mime type
        return send_file(
            file_stream,
            mimetype=uploaded_file.mime_type,
            as_attachment=True,
            download_name=uploaded_file.original_filename
        )
        
    except Exception as e:
        print(f"Download error: {str(e)}")
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
        
        # Get all files from database
        uploaded_files = UploadedFile.query.order_by(UploadedFile.created_at.desc()).all()
        
        files = []
        for uploaded_file in uploaded_files:
            files.append({
                'id': uploaded_file.id,
                'filename': uploaded_file.original_filename,
                'type': uploaded_file.file_type,
                'size': uploaded_file.file_size,
                'url': f"{request.host_url}api/uploads/{uploaded_file.id}",
                'created_at': uploaded_file.created_at.isoformat()
            })
        
        return jsonify({'files': files, 'total': len(files)}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to list files: {str(e)}'}), 500
