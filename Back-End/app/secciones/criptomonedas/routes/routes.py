from flask import Blueprint, jsonify, request
from app.secciones.criptomonedas.models.crypto_model import Crypto
from app.secciones.criptomonedas.utils.utils import obtener_precios_actuales, validar_moneda, symbol_mapping
from core.database import db

criptomonedas_bp = Blueprint('criptomonedas', __name__)

@criptomonedas_bp.route("/precios", methods=["GET"])
def obtener_precios():
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
        
        precios = obtener_precios_actuales(unique_monedas)
        
        for moneda in unique_monedas:
            simbolo = symbol_mapping.get(moneda["nombre"], moneda["nombre"])
            precio_actual = precios.get(simbolo, None)
            moneda["precio_actual"] = round(precio_actual, 8) if precio_actual else 0
            moneda["valor_actual"] = round(moneda["cantidad"] * precio_actual, 2) if precio_actual else 0
            
        return jsonify({"monedas": unique_monedas})
    except Exception as e:
        print(f"Error en /precios: {str(e)}")
        return jsonify({"error": str(e)}), 500

@criptomonedas_bp.route("/monedas", methods=["POST"])
def agregar_moneda():
    try:
        data = request.json
        error = validar_moneda(data)
        if error:
            return jsonify({"error": error}), 400

        nueva_crypto = Crypto(
            nombre=data["nombre"],
            cantidad=float(data["cantidad"]),
            divisa=data["divisa"].upper(),
            tipo=data.get("tipo", "alt")  # default tipo as 'alt' if not provided
        )
        
        db.session.add(nueva_crypto)
        db.session.commit()
        
        return jsonify({"mensaje": "Moneda agregada exitosamente", "moneda": nueva_crypto.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
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