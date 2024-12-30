from flask import Blueprint

# Blueprint para la aplicación de Pizarra
pizarra_bp = Blueprint('pizarra', __name__, url_prefix='/pizarra')

# Importar las rutas para registrarlas en este Blueprint
from .routes import pizarra_bp as pizarra_routes

# Registrar las rutas en el Blueprint
pizarra_bp.register_blueprint(pizarra_routes)