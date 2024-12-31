from core.database import db

class Crypto(db.Model):
    __tablename__ = 'crypts'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(10), nullable=False)
    cantidad = db.Column(db.Float, nullable=False)
    divisa = db.Column(db.String(3), nullable=False)
    tipo = db.Column(db.String(10), nullable=False)
    
    def __init__(self, nombre, cantidad, divisa, tipo):
        self.nombre = nombre
        self.cantidad = cantidad
        self.divisa = divisa
        self.tipo = tipo
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'cantidad': self.cantidad,
            'divisa': self.divisa,
            'tipo': self.tipo
        }

def migrate_cryptos(db):
    from app.secciones.criptomonedas.models.models import monedas
    
    try:
        if Crypto.query.first() is None:
            for moneda in monedas:
                crypto = Crypto(
                    nombre=moneda['nombre'],
                    cantidad=moneda['cantidad'],
                    divisa=moneda['divisa'],
                    tipo=moneda['tipo']
                )
                db.session.add(crypto)
            db.session.commit()
            print("Migration successful")
    except Exception as e:
        db.session.rollback()
        print(f"Migration error: {e}")
