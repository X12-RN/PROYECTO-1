import os
import requests
from datetime import datetime, timedelta
from time import sleep
from pathlib import Path
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from core.database import db
from app.secciones.criptomonedas.models.crypto_model import Crypto
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_api_key():
    try:
        # Start from the current file path.
        current_file = Path(__file__).resolve()
        root_dir = current_file

        # Traverse parent directories until .env is found or we reach the root.
        while root_dir.parent != root_dir:
            root_dir = root_dir.parent
            env_path = root_dir / '.env'
            if env_path.exists():
                load_dotenv(dotenv_path=env_path)
                api_key = os.getenv("COINMARKETCAP_API_KEY")
                if api_key:
                    logger.info("API key loaded successfully")
                    return api_key
                else:
                    logger.error("API key not found in .env file")
                    return None

        logger.error(".env file not found in any parent directory")
        return None

    except Exception as e:
        logger.error(f"Error loading API key: {str(e)}")
        return None

COINMARKETCAP_API_KEY = load_api_key()
if not COINMARKETCAP_API_KEY:
    raise ValueError("COINMARKETCAP_API_KEY not found. Please check your .env file.")

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
    "RDNT": "radiant",
    "S": "sonic",
    "YFI": "yearn-finance",
    "PEPE": "pepe",
    "APE": "apecoin", 
    "MANA": "decentraland",
    "QNT": "quant",
    "FET": "artificial-superintelligence-alliance",
    "JUP": "jupiter",
}

CACHE_DURATION = 600  # 4 minutes in seconds

cache = {
    "data": None,
    "timestamp": datetime.now()
}

def is_symbol_cached(symbol: str) -> bool:
    return cache.get("data") and symbol in cache["data"]

def obtener_precios_actuales(monedas):
    logger.info(f"Attempting to retrieve prices for {[m['nombre'] for m in monedas]}")
    now = datetime.now()
    
    # Return cached data if valid
    if cache["data"] and (now - cache["timestamp"]).seconds < CACHE_DURATION:
        logger.info("Using cached data")
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

        print("COINMARKETCAP_API_KEY:", COINMARKETCAP_API_KEY)
        response = requests.get(url, headers=headers, params=params)
        print("CMC response:", response.json())
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
        logger.info("Cache updated successfully")
        
        return precios
    except Exception as e:
        logger.error(f"Error al obtener precios: {e}")
        return None

def actualizar_precios_db(symbols):
    logger.info(f"Updating DB prices for symbols: {[s['nombre'] for s in symbols]}")
    try:
        precios = obtener_precios_actuales(symbols)
        if precios:
            for symbol in symbols:
                symbol_upper = symbol["nombre"].upper()
                # Skip the cache check if symbol is new or forced:
                if not is_symbol_cached(symbol_upper):
                    logger.info(f"Symbol {symbol_upper} not in cache, fetching new data")
                if symbol_upper in precios:
                    crypto = Crypto.query.filter_by(simbolo=symbol_upper).first()
                    if crypto:
                        crypto.precio_actual = precios[symbol_upper]['USD']
                        crypto.logo = precios[symbol_upper]['logo']  # Actualizar URL del logo
                        db.session.add(crypto)
                        logger.info(f"Updated {symbol_upper} with new price/logo")
            db.session.commit()
            return True
    except Exception as e:
        logger.error(f"Error al actualizar precios en la base de datos: {e}")
        return False

def validar_moneda(data):
    if "cantidad" not in data:
        return "La cantidad es requerida"
    try:
        cantidad = float(data["cantidad"])
        if cantidad < 0:
            return "La cantidad debe ser mayor o igual a 0"
    except ValueError:
        return "La cantidad debe ser un número válido"
    return None

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