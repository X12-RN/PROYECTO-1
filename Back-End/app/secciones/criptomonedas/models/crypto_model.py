from core.database import db

class Crypto(db.Model):
    __tablename__ = 'cryptos'
    id = db.Column(db.Integer, primary_key=True)      # Identificador único
    symbol = db.Column(db.String(10), nullable=False) # Símbolo (e.g., BTC, ETH)
    name = db.Column(db.String(50), nullable=False)   # Nombre (e.g., Bitcoin)
    price = db.Column(db.Float, nullable=False)       # Precio actual
    updated_at = db.Column(db.DateTime, default=db.func.now())  # Última actualización
