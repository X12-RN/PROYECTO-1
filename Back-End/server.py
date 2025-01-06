from flask import Flask
from flask_migrate import Migrate
from flask_socketio import SocketIO 
from flask_cors import CORS
from sqlalchemy import event
from sqlalchemy.pool import QueuePool
from core.database import db
from app import create_app
from app.secciones.criptomonedas.models import migrate_cryptos
from asgiref.wsgi import WsgiToAsgi

def init_db_settings(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db?timeout=30'
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'poolclass': QueuePool,
        'pool_size': 10,
        'max_overflow': 2,
        'pool_timeout': 30,
        'pool_recycle': 1800,
        'connect_args': {
            'timeout': 30,
            'check_same_thread': False
        }
    }
    
    with app.app_context():
        @event.listens_for(db.engine, "connect")
        def set_sqlite_pragma(dbapi_connection, connection_record):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA busy_timeout=30000")
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

        db.create_all()
        migrate_cryptos(db)

def create_server():
    app = create_app()
    
    # Configure CORS
    CORS(app, 
         resources={r"/*": {
             "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "expose_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }}
    )

    # Initialize database settings
    init_db_settings(app)

    # Initialize SocketIO with CORS settings
    socketio = SocketIO(
        app,
        cors_allowed_origins=["http://localhost:5173"],
        async_mode='gevent',
        logger=True,
        engineio_logger=True,
        ping_timeout=60,
        manage_session=False,
        always_connect=True
    )
    
    return app, socketio

# Create and configure application instance
app, socketio = create_server()

# Export the Flask app instance for ASGI servers
application = WsgiToAsgi(app)

if __name__ == '__main__':
    # Run with SocketIO instead of Flask's run method
    socketio.run(app, host='127.0.0.1', port=5000, debug=True, allow_unsafe_werkzeug=True)