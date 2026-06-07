from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os
import shutil
import uuid
from typing import List

import models
import schemas
from database import engine, get_db
from services.gemini_service import analyze_item_image

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vintamie API", version="1.0.0")

# Setup uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# CORS Middleware config
# Allow all origins for local testing, browser extension, and Android WebView
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.post("/api/upload", response_model=schemas.DraftResponse, status_code=status.HTTP_201_CREATED)
def upload_and_analyze(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Verify file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    # Generate a unique file name
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file to disk
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save image: {e}")

    # Analyze image using Gemini AI
    analysis = analyze_item_image(file_path)

    # Save to SQLite database as a draft
    db_draft = models.Draft(
        title=analysis["title"],
        description=analysis["description"],
        category=analysis["category"],
        condition=analysis["condition"],
        price=analysis["price"],
        image_path=f"/uploads/{unique_filename}"  # Relative URL path
    )
    
    try:
        db.add(db_draft)
        db.commit()
        db.refresh(db_draft)
    except Exception as e:
        # Cleanup file if db insertion fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

    return db_draft

@app.get("/api/drafts", response_model=List[schemas.DraftResponse])
def get_all_drafts(db: Session = Depends(get_db)):
    return db.query(models.Draft).order_by(models.Draft.created_at.desc()).all()

@app.get("/api/drafts/{draft_id}", response_model=schemas.DraftResponse)
def get_draft(draft_id: int, db: Session = Depends(get_db)):
    db_draft = db.query(models.Draft).filter(models.Draft.id == draft_id).first()
    if not db_draft:
        raise HTTPException(status_code=404, detail="Draft not found.")
    return db_draft

@app.put("/api/drafts/{draft_id}", response_model=schemas.DraftResponse)
def update_draft(draft_id: int, updated_draft: schemas.DraftUpdate, db: Session = Depends(get_db)):
    db_draft = db.query(models.Draft).filter(models.Draft.id == draft_id).first()
    if not db_draft:
        raise HTTPException(status_code=404, detail="Draft not found.")
    
    # Update fields if provided
    update_data = updated_draft.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_draft, key, value)

    db.commit()
    db.refresh(db_draft)
    return db_draft

@app.delete("/api/drafts/{draft_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_draft(draft_id: int, db: Session = Depends(get_db)):
    db_draft = db.query(models.Draft).filter(models.Draft.id == draft_id).first()
    if not db_draft:
        raise HTTPException(status_code=404, detail="Draft not found.")
    
    # Delete image file from disk
    if db_draft.image_path:
        # Remove leading slash if it's there
        relative_path = db_draft.image_path.lstrip("/")
        if os.path.exists(relative_path):
            try:
                os.remove(relative_path)
            except Exception as e:
                print(f"Error removing image file {relative_path}: {e}")

    db.delete(db_draft)
    db.commit()
    return {"detail": "Draft deleted successfully"}
