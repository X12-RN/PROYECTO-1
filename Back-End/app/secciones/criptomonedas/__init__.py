from flask import Blueprint

# Blueprint para la aplicación de Criptomonedas
criptomonedas_bp = Blueprint('criptomonedas', __name__, url_prefix='/criptomonedas')

# Importar las rutas para registrarlas en este Blueprint
from .routes.routes import criptomonedas_bp as crypto_routes

# Registrar las rutas en el Blueprint
criptomonedas_bp.register_blueprint(crypto_routes)
