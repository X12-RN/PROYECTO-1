from flask import Flask
from flask_migrate import Migrate
from core.database import db
from app import create_app

# Crear la aplicación Flask
app = create_app()

# Inicializar Flask-Migrate
migrate = Migrate(app, db)

if __name__ == '__main__':
    print("=== Iniciando la aplicación Flask ===")
    print(f"Base de datos: {app.config['SQLALCHEMY_DATABASE_URI']}")
    app.run(host="0.0.0.0", port=5001, debug=True)
