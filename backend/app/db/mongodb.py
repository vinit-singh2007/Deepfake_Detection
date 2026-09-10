"""
MongoDB connection lifecycle using Motor (async driver).

Designed to be fully optional for the hackathon demo: when
settings.MONGO_ENABLED is False, every function here is a safe no-op,
so nothing in the app crashes or blocks if Mongo isn't running.
"""

from __future__ import annotations

import logging
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

logger = logging.getLogger(__name__)


class MongoManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None


mongo_manager = MongoManager()


async def connect_to_mongo() -> None:
    """
    Establish the MongoDB connection.
    """
    if not settings.MONGO_ENABLED:
        logger.info("MONGO_ENABLED is False -- skipping MongoDB connection.")
        return

    logger.info("Connecting to MongoDB at %s ...", settings.MONGO_URI)

    mongo_manager.client = AsyncIOMotorClient(
        settings.MONGO_URI,
        serverSelectionTimeoutMS=5000,
    )

    await mongo_manager.client.admin.command("ping")

    mongo_manager.db = mongo_manager.client[settings.MONGO_DB_NAME]

    logger.info(
        "MongoDB connection established (db=%s).",
        settings.MONGO_DB_NAME
    )


async def close_mongo_connection() -> None:
    """Gracefully close the MongoDB connection at app shutdown."""

    if mongo_manager.client is not None:
        mongo_manager.client.close()
        mongo_manager.client = None
        mongo_manager.db = None

        logger.info("MongoDB connection closed.")
    else:
        logger.debug(
            "close_mongo_connection called but no active client existed."
        )


def get_database() -> Optional[AsyncIOMotorDatabase]:
    """
    Accessor for the active database handle.
    """

    if not settings.MONGO_ENABLED:
        return None

    return mongo_manager.db


def get_user_collection():
    """
    Return the users collection.
    """

    db = get_database()

    if db is None:
        raise RuntimeError("MongoDB is not connected")

    return db["user"]


async def save_analysis_record(document: dict) -> Optional[str]:
    """
    Convenience helper to persist an analysis result.
    """

    db = get_database()

    if db is None:
        logger.debug(
            "Mongo disabled/unavailable -- skipping persistence of analysis record."
        )
        return None

    try:
        result = await db["analyses"].insert_one(document)
        return str(result.inserted_id)

    except Exception as exc:
        logger.warning(
            "Failed to persist analysis record: %s",
            exc
        )
        return None