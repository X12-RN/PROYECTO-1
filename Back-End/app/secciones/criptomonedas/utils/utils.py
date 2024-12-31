import os
import requests
from datetime import datetime, timedelta
from time import sleep
from dotenv import load_dotenv

# Load environment variables from root .env file
load_dotenv(dotenv_path="../../.env")

COINMARKETCAP_API_KEY = os.getenv("COINMARKETCAP_API_KEY")

symbol_mapping = {
    "JITO STAKED SOL": "JITOSOL",
    "ETH - RED - ARBITRUM": "ETH",
    "PNG": "PNG",
    "JTO": "JTO",
}

cache = {
    "data": None,
    "timestamp": datetime.now()
}

def obtener_precios_actuales(monedas):
    global cache
    if cache["data"] and datetime.now() - cache["timestamp"] < timedelta(minutes=10):
        return cache["data"]

    try:
        precios = {}
        url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"
        headers = {
            "Accepts": "application/json",
            "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY
        }

        lotes = [monedas[i:i + 10] for i in range(0, len(monedas), 10)]
        for lote in lotes:
            sleep(2)  # Rate limiting
            symbols = [symbol_mapping.get(moneda["nombre"], moneda["nombre"]) for moneda in lote]
            params = {"symbol": ",".join(symbols)}
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()  # Raise exception for bad status codes
            
            data = response.json()
            if "data" not in data:
                print(f"Error en respuesta API: {data}")
                continue
                
            for moneda in lote:
                symbol = symbol_mapping.get(moneda["nombre"], moneda["nombre"])
                if symbol in data["data"]:
                    try:
                        precios[moneda["nombre"]] = data["data"][symbol]["quote"]["USD"]["price"]
                    except KeyError as e:
                        print(f"Error procesando {symbol}: {e}")
                        precios[moneda["nombre"]] = 0
                else:
                    print(f"Símbolo no encontrado: {symbol}")
                    precios[moneda["nombre"]] = 0

        cache["data"] = precios
        cache["timestamp"] = datetime.now()
        return precios

    except requests.exceptions.RequestException as e:
        print(f"Error en solicitud HTTP: {e}")
        return cache["data"] if cache["data"] else {}
    except Exception as e:
        print(f"Error inesperado: {e}")
        return cache["data"] if cache["data"] else {}

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