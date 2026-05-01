from openai import AzureOpenAI
from .config import settings

client = AzureOpenAI(
    api_key=settings.OPENAI_API_KEY,
    api_version=settings.OPENAI_API_VERSION,
    azure_endpoint=settings.OPENAI_API_BASE,
)

def chat_completion(messages, response_format=None):
    """
    Helper so we always use the deployment name from settings.
    """
    kwargs = {
        "model": settings.OPENAI_DEPLOYMENT_NAME,
        "messages": messages,
    }
    if response_format is not None:
        kwargs["response_format"] = response_format
    return client.chat.completions.create(**kwargs)
