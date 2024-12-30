from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker

# Instancia de SQLAlchemy para manejar la base de datos
db = SQLAlchemy()

def init_db(app):
    """
    Inicializa la base de datos con la aplicación Flask.
    
    Parámetros:
        app: Instancia de Flask en la que se inicializa la base de datos.
    """
    try:
        db.init_app(app)
        with app.app_context():
            db.create_all()  # Crea las tablas si no existen
            print("Base de datos inicializada.")
    except Exception as e:
        print(f"Error al inicializar la base de datos: {e}")

def get_db_session():
    """
    Proporciona una sesión de base de datos reutilizable.
    
    Retorna:
        session: Una nueva sesión de base de datos.
    """
    Session = sessionmaker(bind=db.engine)
    session = Session()
    return session
