from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import List, Optional

from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.environ.get("MONGO_URI") or "mongodb+srv://Gaganfnr:ndLz9yHCsOmv9S3k@gagan.jhuti8y.mongodb.net/test?appName=Gagan&compressors=zlib&maxPoolSize=50"

client = AsyncIOMotorClient(MONGO_URI)
db = client.test

@app.get("/access")
async def list_files(
    skip: int = 0,
    limit: int = 100,
    filename: str | None = None,
    folder: str | None = None,
    min_size: int | None = None,
    max_size: int | None = None,
    tier: str | None = None,   # 👈 HOT / WARM / COLD
):
    filter_q = {}

    # 🔍 search by filename
    if filename:
        filter_q["fileName"] = {"$regex": filename, "$options": "i"}

    # 📁 folder filter
    if folder:
        filter_q["fullPath"] = {"$regex": f"^{folder}", "$options": "i"}

    # 📦 size filter
    if min_size is not None or max_size is not None:
        size_q = {}
        if min_size is not None:
            size_q["$gte"] = min_size
        if max_size is not None:
            size_q["$lte"] = max_size
        filter_q["sizeBytes"] = size_q

    # 🧊 tier filter (HOT / WARM / COLD)
    if tier and tier.lower() != "all":
        filter_q["accessClass"] = tier.upper()

    cursor = (
        db.FileMetaAccess
        .find(filter_q, {"_id": 0})
        .sort("fileName", 1)
        .skip(skip)
        .limit(limit)
    )

    docs = await cursor.to_list(length=limit)
    return docs


@app.get("/access/{file_id}")
async def get_file(file_id: str):
    doc = await db.FileMetaAccess.find_one({"fileId": file_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return doc

@app.get("/duplicates")
async def list_duplicates(skip: int = 0, limit: int = 100):
    docs = await db.DuplicateFiles.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(length=limit)
    return docs

@app.get("/duplicates/{fingerprint}")
async def get_duplicate_group(fingerprint: str):
    doc = await db.DuplicateFiles.find_one({"fingerprint": fingerprint}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Duplicate group not found")
    return doc

@app.get("/heatmap")
async def get_heatmap(skip: int = 0, limit: int = 100):
    docs = await db.TrendFolderHeatmap.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(length=limit)
    return docs

@app.get("/trends/daily")
async def list_trends(skip: int = 0, limit: int = 100):
    docs = await db.TrendDailySummary.find({}, {"_id": 0}).sort("date", -1).skip(skip).limit(limit).to_list(length=limit)
    return docs

@app.get("/trends/daily/{date}")
async def get_trend_day(date: str):
    doc = await db.TrendDailySummary.find_one({"date": date}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="No summary found for that date")
    return doc

