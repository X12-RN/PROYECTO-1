from flask import Blueprint, request, jsonify
from app.secciones.pizarra.models.models import Pizarra
from core.database import db

pizarra_bp = Blueprint('pizarra', __name__)

# Crear una nueva pizarra
@pizarra_bp.route('/pizarras', methods=['POST'])
def create_pizarra():
    data = request.json
    new_pizarra = Pizarra(titulo=data['titulo'], contenido=data['contenido'])
    db.session.add(new_pizarra)
    db.session.commit()
    return jsonify(new_pizarra.to_dict()), 201

# Obtener todas las pizarras
@pizarra_bp.route('/pizarras', methods=['GET'])
def get_pizarras():
    pizarras = Pizarra.query.all()
    return jsonify([pizarra.to_dict() for pizarra in pizarras]), 200

# Obtener una pizarra por ID
@pizarra_bp.route('/pizarras/<int:id>', methods=['GET'])
def get_pizarra(id):
    pizarra = Pizarra.query.get(id)
    if not pizarra:
        return jsonify({"error": "Pizarra no encontrada"}), 404
    return jsonify(pizarra.to_dict()), 200

# Actualizar una pizarra existente
@pizarra_bp.route('/pizarras/<int:id>', methods=['PUT'])
def update_pizarra(id):
    data = request.json
    pizarra = Pizarra.query.get(id)
    if not pizarra:
        return jsonify({"error": "Pizarra no encontrada"}), 404
    pizarra.titulo = data.get('titulo', pizarra.titulo)
    pizarra.contenido = data.get('contenido', pizarra.contenido)
    db.session.commit()
    return jsonify(pizarra.to_dict()), 200

# Eliminar una pizarra
@pizarra_bp.route('/pizarras/<int:id>', methods=['DELETE'])
def delete_pizarra(id):
    pizarra = Pizarra.query.get(id)
    if not pizarra:
        return jsonify({"error": "Pizarra no encontrada"}), 404
    db.session.delete(pizarra)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"}), 200