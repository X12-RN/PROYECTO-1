import os
import requests
from datetime import datetime, timedelta
from time import sleep
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from core.database import db
from app.secciones.criptomonedas.models.crypto_model import Crypto

# Load environment variables from root .env file
load_dotenv(dotenv_path="../../.env")

COINMARKETCAP_API_KEY = os.getenv("COINMARKETCAP_API_KEY")

symbol_mapping = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "XRP": "ripple",
    "AVAX": "avalanche",
    "MATIC": "polygon",
    "DOT": "polkadot",
    "LINK": "chainlink",
    "LTC": "litecoin",
    "ATOM": "cosmos",
    "ALGO": "algorand",
    "SAND": "the-sandbox",
    "NEAR": "near-protocol",
    "ADA": "cardano",
    "AXS": "axie-infinity",
    "BCH": "bitcoin-cash",
    "CHZ": "chiliz",
    "XLM": "stellar",
    "LDO": "lido-dao",
    "DYDX": "dydx",
    "BAL": "balancer",
    "MKR": "maker",
    "LRC": "loopring",
    "SNX": "synthetix",
    "TRX": "tron",
    "BAT": "basic-attention-token",
    "ARB": "arbitrum",
    "GRT": "the-graph",
    "OMG": "omg",
    "UNI": "uniswap",
    "SUSHI": "sushiswap",
    "ENJ": "enjin-coin",
    "DOGE": "dogecoin",
    "SHIB": "shiba-inu",
    "SOL": "solana",
    "RAY": "raydium",
    "FIDA": "bonfida",
    "JITOSOL": "jito-staked-sol",
    "PNG": "pangolin",
    "RDNT": "radiant"
}

CACHE_DURATION = 120  # 2 minutes in seconds

cache = {
    "data": None,
    "timestamp": datetime.now()
}

def obtener_precios_actuales(monedas):
    now = datetime.now()
    
    # Return cached data if valid
    if cache["data"] and (now - cache["timestamp"]).seconds < CACHE_DURATION:
        return cache["data"]
    
    try:
        precios = {}
        url = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest"
        headers = {
            "Accepts": "application/json",
            "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY
        }

        # Remove duplicates
        unique_symbols = list({moneda["nombre"].upper() for moneda in monedas})
        symbols = ",".join(unique_symbols)

        params = {
            "symbol": symbols,
            "convert": "USD"
        }

        response = requests.get(url, headers=headers, params=params)
        data = response.json()

        if "data" in data:
            for symbol, info in data["data"].items():
                if isinstance(info, list):
                    info = info[0]
                # Use CMC ID to construct logo URL
                cmc_id = info.get("id", "")
                logo_url = f"https://s2.coinmarketcap.com/static/img/coins/64x64/{cmc_id}.png"
                precios[symbol] = {
                    "USD": info["quote"]["USD"]["price"],
                    "logo": logo_url
                }
        
        # Cache the results
        cache["data"] = precios
        cache["timestamp"] = now
        
        return precios
    except Exception as e:
        print(f"Error al obtener precios: {e}")
        return None

def actualizar_precios_db(symbols):
    try:
        precios = obtener_precios_actuales(symbols)
        if precios:
            for symbol in symbols:
                symbol_upper = symbol["nombre"].upper()
                if symbol_upper in precios:
                    crypto = Crypto.query.filter_by(simbolo=symbol_upper).first()
                    if crypto:
                        crypto.precio_actual = precios[symbol_upper]['USD']
                        crypto.logo = precios[symbol_upper]['logo']  # Actualizar URL del logo
                        db.session.add(crypto)
            db.session.commit()
            return True
    except Exception as e:
        print(f"Error al actualizar precios en la base de datos: {e}")
        return False

def validar_moneda(data):
    required_fields = ["nombre", "cantidad", "divisa", "tipo"]
    for field in required_fields:
        if field not in data:
            return False
    return True

def sincronizar_monedas():
    from app.secciones.criptomonedas.models.crypto_model import Crypto, monedas
    try:
        if Crypto.query.first() is None:
            for moneda in monedas:
                nombre = moneda['nombre'].upper()
                simbolo = nombre.split(' - ')[0]  # Get first part before any dash
                
                crypto = Crypto(
                    nombre=nombre,
                    cantidad=moneda['cantidad'],
                    simbolo=simbolo,
                    precio_actual=None,  # Will be updated by CoinMarketCap API
                    tipo=moneda.get('tipo', 'alt'),
                    logo=None  # Will be generated from symbol in routes.py
                )
                db.session.add(crypto)
            db.session.commit()
            print("Migration successful")
    except Exception as e:
        db.session.rollback()
        print(f"Migration error: {e}")

# Inicializar scheduler
scheduler = BackgroundScheduler()