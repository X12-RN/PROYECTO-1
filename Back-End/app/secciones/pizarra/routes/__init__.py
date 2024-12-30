from flask import Blueprint

# Crear el blueprint
pizarra_bp = Blueprint('pizarra', __name__)

# Importar las rutas para registrarlas en este Blueprint
from .routes import *

# Registrar las rutas en el Blueprint