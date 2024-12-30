import pytest
from app import create_app
from core.database import db
from app.models.user import User

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()

def test_register(client):
    response = client.post('/auth/register', json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    assert response.json['message'] == "User registered successfully"

def test_login(client):
    client.post('/auth/register', json={"username": "testuser", "password": "testpassword"})
    response = client.post('/auth/login', json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json['message'] == "Logged in successfully"

def test_invalid_login(client):
    response = client.post('/auth/login', json={"username": "wronguser", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json['message'] == "Invalid credentials"

def test_logout(client):
    client.post('/auth/register', json={"username": "testuser", "password": "testpassword"})
    client.post('/auth/login', json={"username": "testuser", "password": "testpassword"})
    response = client.post('/auth/logout')
    assert response.status_code == 200
    assert response.json['message'] == "Logged out successfully"