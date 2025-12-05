from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth import auth_bp
from routes.applications import applications_bp
from routes.uploads import uploads_bp

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
db.init_app(app)
mail = Mail(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(applications_bp, url_prefix='/api')
app.register_blueprint(uploads_bp, url_prefix='/api')

# Make mail and bcrypt available globally
app.mail = mail
app.bcrypt = bcrypt

@app.route('/')
def home():
    return {"message": "Creo Studios API is running!", "status": "success"}

# Create tables if they don't exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
