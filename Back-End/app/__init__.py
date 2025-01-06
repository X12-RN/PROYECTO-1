from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from core.database import db
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os
from app.secciones.criptomonedas.routes.routes import init_app
from app.extensions import scheduler  # Importar el scheduler

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config.from_object('config.Config') 

    # Inicializar extensiones
    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Inicializar LoginManager
    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # Implementar la carga del usuario
        pass

    # Inicializar el scheduler
    scheduler.init_app(app)
    scheduler.start()

    # Registrar blueprints
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

    with app.app_context():
        init_app(app)

    return app