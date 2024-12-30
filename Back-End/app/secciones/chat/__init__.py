from flask import Blueprint

# Blueprint para la aplicación de Chat
chat_bp = Blueprint('chat', __name__, url_prefix='/chat')

# Importar las rutas desde el módulo `routes`
from app.secciones.chat.routes.routes import chat_bp as chat_routes
