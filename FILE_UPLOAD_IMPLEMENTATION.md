# File Upload Implementation Guide

## Current Status ✅
The frontend now has **local file upload buttons** for:
- **Video Editing / Video Production**: Upload video files (.mp4, .mov, .avi, .mkv)
- **Poster Design / Graphic Design**: Upload design files (.png, .jpg, .jpeg, .pdf, .psd, .ai)

## Features Added
1. **Upload Button**: Blue gradient button next to URL input field
2. **Progress Bar**: Visual upload progress indicator
3. **File Info Display**: Shows uploaded file name and size
4. **File Validation**: Accepts only specified file types
5. **Dual Input**: Can either upload file OR paste URL

## What's Working Now
- ✅ File selection from local storage
- ✅ Progress bar animation
- ✅ File size validation
- ✅ File type filtering
- ✅ UI feedback (success message, file info)

## What Needs Backend Implementation

### Option 1: Cloud Storage (Recommended)
Upload files to cloud storage services:

#### **Google Drive API**
```python
# backend/routes/upload.py
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

@app.route('/api/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    
    # Upload to Google Drive
    service = build('drive', 'v3', credentials=creds)
    file_metadata = {'name': file.filename}
    media = MediaFileUpload(file, resumable=True)
    
    uploaded_file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, webViewLink'
    ).execute()
    
    return jsonify({
        'url': uploaded_file['webViewLink'],
        'file_id': uploaded_file['id']
    })
```

#### **AWS S3**
```python
# backend/routes/upload.py
import boto3

s3_client = boto3.client('s3')

@app.route('/api/upload', methods=['POST'])
def upload_to_s3():
    file = request.files['file']
    
    s3_client.upload_fileobj(
        file,
        'your-bucket-name',
        file.filename,
        ExtraArgs={'ACL': 'public-read'}
    )
    
    url = f"https://your-bucket-name.s3.amazonaws.com/{file.filename}"
    return jsonify({'url': url})
```

#### **Cloudinary (Images/Videos)**
```python
# backend/routes/upload.py
import cloudinary.uploader

@app.route('/api/upload', methods=['POST'])
def upload_to_cloudinary():
    file = request.files['file']
    
    result = cloudinary.uploader.upload(
        file,
        resource_type='auto'  # Handles images and videos
    )
    
    return jsonify({'url': result['secure_url']})
```

### Option 2: Local Server Storage (Not Recommended for Production)
```python
# backend/routes/upload.py
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads/'

@app.route('/api/upload', methods=['POST'])
def upload_local():
    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    file.save(filepath)
    
    # Generate accessible URL
    url = f"{request.host_url}uploads/{filename}"
    return jsonify({'url': url})
```

## Frontend Integration

Once backend is ready, update `handleFileUpload` function:

```javascript
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setUploadProgress(0);
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Upload to your backend
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    const data = await response.json();
    
    // Update delivery data with the uploaded file URL
    setDeliveryData(prev => ({
      ...prev,
      delivery_file_url: data.url
    }));
    
    setUploadedFile(file);
    setUploadProgress(100);
    toast.success(`File uploaded successfully!`);
    
    setTimeout(() => setUploadProgress(0), 1500);
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    setUploadProgress(0);
  }
};
```

## Installation Requirements

### For Google Drive:
```bash
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

### For AWS S3:
```bash
pip install boto3
```

### For Cloudinary:
```bash
pip install cloudinary
```

## Recommended Solution
**Cloudinary** is recommended because:
- ✅ Free tier: 25GB storage, 25GB bandwidth
- ✅ Automatic image/video optimization
- ✅ Built-in CDN for fast delivery
- ✅ Easy integration
- ✅ Supports all media types (images, videos, PDFs)

## Configuration Steps (Cloudinary)

1. Sign up at https://cloudinary.com
2. Get your credentials from dashboard
3. Add to `backend/config.py`:
```python
import cloudinary

cloudinary.config(
    cloud_name="your_cloud_name",
    api_key="your_api_key",
    api_secret="your_api_secret"
)
```

4. Create upload endpoint in `backend/routes/applications.py`
5. Update frontend `handleFileUpload` function

## File Size Limits
Consider adding file size validation:
- Videos: Max 500MB recommended
- Images/PDFs: Max 50MB recommended

Add to frontend:
```javascript
const MAX_FILE_SIZE = {
  video: 500 * 1024 * 1024, // 500MB
  image: 50 * 1024 * 1024    // 50MB
};

if (file.size > MAX_FILE_SIZE.video) {
  toast.error('File is too large. Maximum size is 500MB');
  return;
}
```

## Current Workaround
Until backend is implemented, admins should:
1. Upload files to Google Drive manually
2. Set sharing to "Anyone with the link"
3. Copy the share link
4. Paste the link in the URL field

The upload button currently shows a reminder message to do this.
