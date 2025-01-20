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
        data = request.json
        nombre = data.get('nombre')
        simbolo = data.get('simbolo')
        cantidad = data.get('cantidad', 0.0)

        # Validar datos
        if not nombre or not simbolo:
            return jsonify({"error": "Nombre y símbolo son requeridos"}), 400

        # Verificar que el símbolo exista en symbol_mapping
        if simbolo.upper() not in symbol_mapping:
            return jsonify({"error": f"Símbolo {simbolo} no soportado"}), 400

        # Obtener el coin_id para CoinMarketCap
        coin_id = symbol_mapping[simbolo.upper()]

        nueva_moneda = Crypto(
            nombre=nombre,
            simbolo=simbolo.upper(),
            cantidad=float(cantidad),
            precio_actual=0.0,  # Se actualizará después
            tipo='alt',  # Valor por defecto
            logo=None   # Se actualizará después
        )

        db.session.add(nueva_moneda)
        db.session.commit()

        # Actualizar precio y logo inmediatamente
        cryptos = [{"nombre": simbolo.upper()}]
        actualizar_precios_db(cryptos)
        
        return jsonify(nueva_moneda.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500  
    
    
@criptomonedas_bp.route("/monedas/<int:id>", methods=["PUT"])
def actualizar_moneda(id):
    try:
        crypto = Crypto.query.get_or_404(id)
        data = request.json
        
        # Solo actualizamos la cantidad, no necesitamos validar otros campos
        if "cantidad" in data:
            crypto.cantidad = float(data["cantidad"])
            db.session.commit()
            return jsonify({
                "mensaje": "Cantidad actualizada exitosamente", 
                "moneda": crypto.to_dict()
            })
        else:
            return jsonify({"error": "No se proporcionó la cantidad"}), 400
            
    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar moneda: {str(e)}")
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