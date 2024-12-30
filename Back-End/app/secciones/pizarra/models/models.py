from core.database import db

class Pizarra(db.Model):
    __tablename__ = 'pizarras'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "contenido": self.contenido,
            "fecha_creacion": self.fecha_creacion
        }

    def __repr__(self):
        return f"<Pizarra {self.titulo}>"