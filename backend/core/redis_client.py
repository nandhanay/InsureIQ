import redis.asyncio as redis
from core.config import settings

redis_client = None


async def get_redis():
    global redis_client
    if redis_client is None:
        redis_client = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
    return redis_client
