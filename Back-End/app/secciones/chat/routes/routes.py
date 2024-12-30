from flask import Blueprint, request, jsonify
from app.secciones.chat.models.chat_model import ChatMessage
from core.database import db

chat_bp = Blueprint('chat', __name__)

# Crear un nuevo mensaje
@chat_bp.route('/messages', methods=['POST'])
def create_message():
    data = request.json
    new_message = ChatMessage(sender=data['sender'], message=data['message'])
    db.session.add(new_message)
    db.session.commit()
    return jsonify(new_message.to_dict()), 201

# Obtener todos los mensajes
@chat_bp.route('/messages', methods=['GET'])
def get_messages():
    messages = ChatMessage.query.all()
    return jsonify([message.to_dict() for message in messages]), 200

# Actualizar un mensaje existente
@chat_bp.route('/messages/<int:id>', methods=['PUT'])
def update_message(id):
    data = request.json
    message = db.session.get(ChatMessage, id)  # Usando db.session.get()
    if not message:
        return jsonify({"message": "Message not found"}), 404
    message.sender = data.get('sender', message.sender)
    message.message = data.get('message', message.message)
    db.session.commit()
    return jsonify(message.to_dict()), 200

# Eliminar un mensaje
@chat_bp.route('/messages/<int:id>', methods=['DELETE'])
def delete_message(id):
    message = db.session.get(ChatMessage, id)
    db.session.delete(message)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"}), 200