import os
from dotenv import load_dotenv

# Load variables from .env file in the backend folder
load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        self.OPENAI_API_BASE: str = os.getenv("OPENAI_API_BASE", "")
        self.OPENAI_API_VERSION: str = os.getenv("OPENAI_API_VERSION", "2024-02-15-preview")
        self.OPENAI_DEPLOYMENT_NAME: str = os.getenv("OPENAI_DEPLOYMENT_NAME", "gpt-4o-mini")


settings = Settings()
