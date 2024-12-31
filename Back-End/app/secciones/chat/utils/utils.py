import os
from dotenv import load_dotenv

# Load environment variables from root .env file
load_dotenv(dotenv_path="../../.env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def obtener_api_key_openai():
    return OPENAI_API_KEY