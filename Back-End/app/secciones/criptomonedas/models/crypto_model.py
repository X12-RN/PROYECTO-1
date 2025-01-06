from core.database import db

class Crypto(db.Model):
    __tablename__ = 'crypts'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    cantidad = db.Column(db.Float, nullable=False)
    simbolo = db.Column(db.String(10), nullable=False)
    precio_actual = db.Column(db.Float, nullable=True)
    tipo = db.Column(db.String(20), nullable=True)
    logo = db.Column(db.String(255), nullable=True)

    def __init__(self, nombre, cantidad, simbolo, precio_actual, tipo, logo):
        self.nombre = nombre
        self.cantidad = cantidad
        self.simbolo = simbolo
        self.precio_actual = precio_actual
        self.tipo = tipo
        self.logo = logo
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'cantidad': self.cantidad,
            'simbolo': self.simbolo,
            'precio_actual': self.precio_actual,
            'tipo': self.tipo,
            'logo': self.logo  # Include logo in response
        }

def migrate_cryptos(db):
    from app.secciones.criptomonedas.models.models import monedas
    from app.secciones.criptomonedas.utils.utils import symbol_mapping
    
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