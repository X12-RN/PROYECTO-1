from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from core.database import db
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS  # Importar Flask-CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config.from_object('config.Config') 

    # Inicializar SQLAlchemy
    db.init_app(app)

    # Inicializar Flask-Migrate
    migrate = Migrate(app, db)

    # Inicializar LoginManager
    login_manager = LoginManager()
    login_manager.init_app(app)

    # Inicializar Flask-CORS
    CORS(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Registrar Blueprints
    from app.secciones.chat.routes import chat_bp
    app.register_blueprint(chat_bp, url_prefix='/chat')
    
    from app.secciones.pizarra.routes.routes import pizarra_bp
    app.register_blueprint(pizarra_bp, url_prefix='/pizarra')
    
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from app.secciones.criptomonedas.routes.routes import criptomonedas_bp
    app.register_blueprint(criptomonedas_bp, url_prefix='/criptomonedas')

    # Configurar Swagger
    SWAGGER_URL = '/swagger'
    API_URL = '/static/swagger.json'
    swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={'app_name': "My Flask App"})
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    return app