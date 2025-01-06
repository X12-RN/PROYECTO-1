from datetime import datetime, timedelta  # Asegúrate de importar datetime
from flask import Blueprint, jsonify, request
from app.extensions import scheduler
from app.secciones.criptomonedas.models.crypto_model import Crypto
from app.secciones.criptomonedas.utils.utils import obtener_precios_actuales, actualizar_precios_db
from core.database import db

criptomonedas_bp = Blueprint('criptomonedas', __name__)

@criptomonedas_bp.route("/precios", methods=["GET"]) 
def obtener_precios():
    try:
        cryptos = Crypto.query.all()
        monedas = []
        
        # Obtener todos los símbolos
        all_symbols = [{"nombre": crypto.simbolo.upper()} for crypto in cryptos]
        
        # Actualizar precios en la base de datos
        actualizar_precios_db(all_symbols)
        
        # Devolver datos actualizados desde la base de datos
        for crypto in cryptos:
            crypto_dict = crypto.to_dict()
            monedas.append(crypto_dict)
            
        return jsonify({"monedas": monedas})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@criptomonedas_bp.route("/monedas", methods=["POST"])
def agregar_moneda():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        simbolo = data.get('simbolo')

        if not nombre or not simbolo:
            return jsonify({"error": "Nombre y símbolo son requeridos."}), 400

        # Validar si la moneda ya existe
        existente = Crypto.query.filter_by(simbolo=simbolo.upper()).first()
        if existente:
            return jsonify({"error": "La moneda ya existe."}), 400

        nueva_moneda = Crypto(
            nombre=nombre,
            simbolo=simbolo.upper(),
            precio_actual=0.0  # Valor por defecto
        )

        db.session.add(nueva_moneda)
        db.session.commit()

        return jsonify(nueva_moneda.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error al agregar moneda: {str(e)}")
        return jsonify({"error": str(e)}), 500

@criptomonedas_bp.route("/monedas/<int:id>", methods=["PUT"])
def actualizar_moneda(id):
    try:
        crypto = Crypto.query.get_or_404(id)
        data = request.json
        
        error = validar_moneda(data)
        if error:
            return jsonify({"error": error}), 400
        
        crypto.nombre = data["nombre"]
        crypto.cantidad = float(data["cantidad"])
        crypto.divisa = data["divisa"].upper()
        if "tipo" in data:
            crypto.tipo = data["tipo"]
            
        db.session.commit()
        return jsonify({"mensaje": "Moneda actualizada exitosamente", "moneda": crypto.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@criptomonedas_bp.route("/monedas/<int:id>", methods=["DELETE"])
def eliminar_moneda(id):
    try:
        crypto = Crypto.query.get_or_404(id)
        db.session.delete(crypto)
        db.session.commit()
        return jsonify({"mensaje": "Moneda eliminada exitosamente"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@criptomonedas_bp.route("/monedas", methods=["GET"])
def obtener_monedas():
    try:
        cryptos = Crypto.query.all()
        monedas = [crypto.to_dict() for crypto in cryptos]
        
        # Filtrar monedas duplicadas
        unique_monedas = []
        seen = set()
        for moneda in monedas:
            if moneda["nombre"] not in seen:
                unique_monedas.append(moneda)
                seen.add(moneda["nombre"])
        
        return jsonify({"monedas": unique_monedas})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@criptomonedas_bp.route('/all-cryptos', methods=['GET'])
def get_all_cryptos():
    try:
        cryptos = Crypto.query.all()
        return jsonify([{
            'id': crypto.id,
            'nombre': crypto.nombre,
            'simbolo': crypto.simbolo,
            'precio_actual': crypto.precio_actual,
            'cantidad': crypto.cantidad,
            'tipo': crypto.tipo,
            'logo': crypto.logo or f"https://s2.coinmarketcap.com/static/img/coins/64x64/{crypto.id}.png"
        } for crypto in cryptos]), 200
    except Exception as e:
        print(f"Error getting cryptos: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

# Iniciar tarea programada al arrancar la aplicación
def init_app(app):
    def update_job():
        with app.app_context():
            cryptos = Crypto.query.all()
            symbols = [{"nombre": crypto.simbolo} for crypto in cryptos]
            actualizar_precios_db(symbols)

    scheduler.add_job(
        id='update_crypto_prices',
        func=update_job,
        trigger='interval',
        minutes=2
    )