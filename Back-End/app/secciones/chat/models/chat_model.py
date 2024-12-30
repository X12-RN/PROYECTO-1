from core.database import db

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "sender": self.sender,
            "message": self.message,
            "timestamp": self.timestamp.isoformat()  # Serializar timestamp como ISO 8601
        }
