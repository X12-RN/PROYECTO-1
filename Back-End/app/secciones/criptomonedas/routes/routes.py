from flask import Blueprint, jsonify, request
from app.secciones.criptomonedas.models.models import monedas
from app.secciones.criptomonedas.utils.utils import obtener_precios_actuales, validar_moneda, symbol_mapping

criptomonedas_bp = Blueprint('criptomonedas', __name__)

@criptomonedas_bp.route("/precios", methods=["GET"])
def obtener_precios():
    try:
        precios = obtener_precios_actuales(monedas)
        for moneda in monedas:
            simbolo = symbol_mapping.get(moneda["nombre"], moneda["nombre"])
            precio_actual = precios.get(simbolo, None)
            moneda["precio_actual"] = round(precio_actual, 8) if precio_actual else 0
            moneda["valor_actual"] = round(moneda["cantidad"] * precio_actual, 2) if precio_actual else 0
        return jsonify({"monedas": monedas})
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
        nueva_moneda = {
            "nombre": data["nombre"],
            "cantidad": float(data["cantidad"]),
            "divisa": data["divisa"].upper(),
        }
        monedas.append(nueva_moneda)
        return jsonify({"mensaje": "Moneda agregada exitosamente.", "monedas": monedas}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@criptomonedas_bp.route("/monedas/<string:nombre>", methods=["DELETE"])
def eliminar_moneda(nombre):
    global monedas
    monedas = [moneda for moneda in monedas if moneda["nombre"].lower() != nombre.lower()]
    return jsonify({"mensaje": "Moneda eliminada exitosamente.", "monedas": monedas})

@criptomonedas_bp.route("/monedas", methods=["GET"])
def listar_monedas():
    return jsonify({"monedas": monedas})