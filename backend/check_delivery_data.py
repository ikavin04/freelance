from models import db, Application
from app import app

with app.app_context():
    apps = Application.query.filter_by(status='completed').all()
    
    if not apps:
        print("No completed applications found")
    else:
        for application in apps:
            print(f"\n{'='*60}")
            print(f"Application ID: {application.id}")
            print(f"Service: {application.service_type}")
            print(f"Client: {application.client_name}")
            print(f"Status: {application.status}")
            print(f"\nDelivery Data:")
            print(f"  delivery_file_url: {application.delivery_file_url}")
            print(f"  delivery_apk_url: {application.delivery_apk_url}")
            print(f"  delivery_github_url: {application.delivery_github_url}")
            print(f"  delivery_deployed_url: {application.delivery_deployed_url}")
            print(f"  delivery_notes: {application.delivery_notes}")
            print(f"  delivered_at: {application.delivered_at}")
            print(f"\nto_dict() output:")
            import json
            print(json.dumps(application.to_dict(), indent=2))
