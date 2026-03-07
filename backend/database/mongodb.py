from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

load_dotenv()
from typing import Optional, List, Dict, Any

# Get MongoDB URI from environment variable
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "medicalreport")

class MongoDBConnection:
    _client: Optional[MongoClient] = None
    _db = None

    @classmethod
    def connect(cls):
        """Establish MongoDB connection"""
        try:
            cls._client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            cls._client.admin.command("ping")
            cls._db = cls._client[DB_NAME]
            print("✓ MongoDB Connected Successfully")
            return cls._db
        except ServerSelectionTimeoutError as e:
            print(f"✗ MongoDB Connection Failed: {e}")
            raise

    @classmethod
    def disconnect(cls):
        """Close MongoDB connection"""
        if cls._client:
            cls._client.close()
            print("✓ MongoDB Disconnected")

    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls._db is None:
            cls.connect()
        return cls._db


# Service functions for reports
async def save_report(report_data: Dict[str, Any]) -> str:
    """Save a medical report to MongoDB"""
    db = MongoDBConnection.get_db()
    result = db.reports.insert_one(report_data)
    return str(result.inserted_id)


async def get_report(report_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a report by ID"""
    from bson import ObjectId
    db = MongoDBConnection.get_db()
    report = db.reports.find_one({"_id": ObjectId(report_id)})
    if report:
        report["_id"] = str(report["_id"])
    return report


async def get_user_reports(user_id: str) -> List[Dict[str, Any]]:
    """Retrieve all reports for a user"""
    db = MongoDBConnection.get_db()
    reports = list(db.reports.find({"user_id": user_id}))
    for report in reports:
        report["_id"] = str(report["_id"])
    return reports


async def update_report(report_id: str, update_data: Dict[str, Any]) -> bool:
    """Update a report"""
    from bson import ObjectId
    db = MongoDBConnection.get_db()
    result = db.reports.update_one(
        {"_id": ObjectId(report_id)},
        {"$set": update_data}
    )
    return result.modified_count > 0


async def delete_report(report_id: str) -> bool:
    """Delete a report"""
    from bson import ObjectId
    db = MongoDBConnection.get_db()
    result = db.reports.delete_one({"_id": ObjectId(report_id)})
    return result.deleted_count > 0


# Service functions for users
async def save_user(user_data: Dict[str, Any]) -> str:
    """Save a user to MongoDB"""
    db = MongoDBConnection.get_db()
    result = db.users.insert_one(user_data)
    return str(result.inserted_id)


async def get_user(user_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a user by ID"""
    from bson import ObjectId
    db = MongoDBConnection.get_db()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
    return user


async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Retrieve a user by email"""
    db = MongoDBConnection.get_db()
    user = db.users.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])
    return user


async def update_user(user_id: str, update_data: Dict[str, Any]) -> bool:
    """Update a user"""
    from bson import ObjectId
    db = MongoDBConnection.get_db()
    result = db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    return result.modified_count > 0


async def delete_user(user_id: str) -> bool:
    """Delete a user"""
    from bson import ObjectId
    db = MongoDBConnection.get_db()
    result = db.users.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count > 0