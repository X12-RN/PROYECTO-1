import pytest
from app import create_app
from core.database import db
from app.secciones.chat.models.chat_model import ChatMessage

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        # Limpiar la base de datos después de cada prueba
        with app.app_context():
            db.session.remove()
            db.drop_all()

def test_create_message(client):
    response = client.post('/chat/messages', json={"sender": "Alice", "message": "Hello"})
    assert response.status_code == 201
    assert response.json['sender'] == "Alice"
    assert response.json['message'] == "Hello"

def test_get_messages(client):
    client.post('/chat/messages', json={"sender": "Alice", "message": "Hello"})
    response = client.get('/chat/messages')
    assert response.status_code == 200
    assert len(response.json) == 1

def test_update_message(client):
    response = client.post('/chat/messages', json={"sender": "Alice", "message": "Hello"})
    message_id = response.json['id']

    response = client.put(f'/chat/messages/{message_id}', json={"sender": "Bob"})
    assert response.status_code == 200
    assert response.json['sender'] == "Bob"
    assert response.json['message'] == "Hello"

def test_delete_message(client):
    # Crear un mensaje
    response = client.post('/chat/messages', json={"sender": "Alice", "message": "Hello"})
    message_id = response.json['id']

    # Eliminar el mensaje
    response = client.delete(f'/chat/messages/{message_id}')
    assert response.status_code == 200
    assert response.json['message'] == 'Deleted successfully'

    # Verificar que el mensaje ha sido eliminado
    response = client.get('/chat/messages')
    assert response.status_code == 200
    assert len(response.json) == 0
