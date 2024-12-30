import requests
from datetime import datetime, timedelta
from time import sleep

symbol_mapping = {
    "JITO STAKED SOL": "JITOSOL",
    "ETH - RED - ARBITRUM": "ETH",
    
    "PNG": "PNG",
    "JTO": "JTO",
    # Agrega más mapeos si es necesario
}

# Cache para almacenar los datos de precios
cache = {
    "data": None,
    "timestamp": datetime.now()
}

def obtener_precios_actuales(monedas):
    global cache
    # Verificar si los datos en el cache son válidos (por ejemplo, 10 minutos)
    if cache["data"] and datetime.now() - cache["timestamp"] < timedelta(minutes=10):
        return cache["data"]

    # Si el cache no es válido, hacer una nueva solicitud a la API
    try:
        precios = {}
        api_key = "b355abd4-a64b-48ec-973d-35e4761e56e6"
        url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"
        headers = {"Accepts": "application/json", "X-CMC_PRO_API_KEY": api_key}

        lotes = [monedas[i:i + 10] for i in range(0, len(monedas), 10)]
        for lote in lotes:
            sleep(2)
            symbols = ",".join(
                symbol_mapping.get(moneda["nombre"], moneda["nombre"]) for moneda in lote
            )
            params = {"symbol": symbols, "convert": "USD"}
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

            for moneda in monedas:
                symbol = symbol_mapping.get(moneda["nombre"], moneda["nombre"])
                if symbol in data["data"]:
                    precios[moneda["nombre"]] = data["data"][symbol]["quote"]["USD"]["price"]

        # Actualizar el cache
        cache["data"] = precios
        cache["timestamp"] = datetime.now()

        return precios
    except Exception as e:
        print(f"Error al obtener precios: {e}")
        return {}

def validar_moneda(data):
    if not data.get("nombre"):
        return "El nombre de la moneda es obligatorio."
    if "cantidad" in data and (not isinstance(data["cantidad"], (int, float)) or data["cantidad"] < 0):
        return "La cantidad debe ser un número positivo."
    if "inversion" in data and (not isinstance(data["inversion"], (int, float)) or data["inversion"] < 0):
        return "La inversión debe ser un número positivo."
    if not data.get("divisa") or data["divisa"].upper() not in ["MXN", "USD"]:
        return "La divisa debe ser MXN o USD."
    return None

def sincronizar_monedas():
    from app.secciones.criptomonedas.models import monedas
    precios = obtener_precios_actuales(monedas)
    if precios:
        monedas[:] = [moneda for moneda in monedas if moneda["nombre"] in precios]
    else:
        print("No se encontraron precios válidos en la sincronización. Monedas no modificadas.")