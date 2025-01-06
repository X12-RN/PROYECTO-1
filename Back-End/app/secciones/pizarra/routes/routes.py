from flask import Blueprint, jsonify, request
from ..models.models import Pizarra
from core.database import db

pizarra_bp = Blueprint('pizarra', __name__, url_prefix='/pizarra')

@pizarra_bp.route('/pizarras', methods=['GET'])
def get_pizarras():
    pizarras = Pizarra.query.all()
    return jsonify([p.to_dict() for p in pizarras])

@pizarra_bp.route('/pizarras', methods=['POST'])
def create_pizarra():
    data = request.json
    pizarra = Pizarra(
        titulo=data.get('titulo', 'Sin título'),
        contenido=data.get('contenido', '')
    )
    db.session.add(pizarra)
    db.session.commit()
    return jsonify(pizarra.to_dict()), 201

@pizarra_bp.route('/pizarras/<int:id>', methods=['PUT'])
def update_pizarra(id):
    data = request.json
    pizarra = Pizarra.query.get_or_404(id)
    pizarra.titulo = data['titulo']    # <-- Aquí salta el KeyError si falta 'titulo'
    pizarra.contenido = data['contenido']
    db.session.commit()
    return jsonify(pizarra.to_dict())

@pizarra_bp.route('/pizarras/<int:id>', methods=['DELETE'])
def delete_pizarra(id):
    pizarra = Pizarra.query.get_or_404(id)
    db.session.delete(pizarra)
    db.session.commit()
    return '', 204

@pizarra_bp.route('/pizarras/<int:id>', methods=['GET'])
def get_pizarra(id):
    pizarra = Pizarra.query.get_or_404(id)
    return jsonify(pizarra.to_dict())