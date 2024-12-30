import pytest
from app import create_app
from core.database import db
from app.secciones.pizarra.models.models import Pizarra

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()

def test_create_pizarra(client):
    response = client.post('/pizarra/pizarras', json={"titulo": "Test Pizarra", "contenido": "This is a test."})
    assert response.status_code == 201
    assert response.json['titulo'] == "Test Pizarra"

def test_get_pizarras(client):
    client.post('/pizarra/pizarras', json={"titulo": "Test Pizarra", "contenido": "This is a test."})
    response = client.get('/pizarra/pizarras')
    assert response.status_code == 200
    assert len(response.json) == 1

def test_update_pizarra(client):
    response = client.post('/pizarra/pizarras', json={"titulo": "Test Pizarra", "contenido": "This is a test."})
    pizarra_id = response.json['id']
    response = client.put(f'/pizarra/pizarras/{pizarra_id}', json={"titulo": "Updated Title"})
    assert response.status_code == 200
    assert response.json['titulo'] == "Updated Title"

def test_delete_pizarra(client):
    response = client.post('/pizarra/pizarras', json={"titulo": "Test Pizarra", "contenido": "This is a test."})
    pizarra_id = response.json['id']
    response = client.delete(f'/pizarra/pizarras/{pizarra_id}')
    assert response.status_code == 200
    response = client.get('/pizarra/pizarras')
    assert len(response.json) == 0
