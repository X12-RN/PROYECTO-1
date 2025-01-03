"""Initial migration

Revision ID: 5cd6639910d2
Revises: b4e6c80ea805
Create Date: 2024-12-28 05:04:39.063851

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5cd6639910d2'
down_revision = 'b4e6c80ea805'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chat_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('sender', sa.String(length=50), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('pizarras',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('titulo', sa.String(length=100), nullable=False),
    sa.Column('contenido', sa.Text(), nullable=False),
    sa.Column('fecha_creacion', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('pizarras')
    op.drop_table('chat_messages')
    # ### end Alembic commands ###
