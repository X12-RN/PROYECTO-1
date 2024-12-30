from flask import Blueprint

# Crear el blueprint
chat_bp = Blueprint('chat', __name__)

# Importar las rutas para registrarlas en este Blueprint
from .routes import *

# Registrar las rutas en el Blueprint