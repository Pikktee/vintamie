from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DraftBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    price: Optional[float] = None

class DraftCreate(DraftBase):
    pass

class DraftUpdate(DraftBase):
    pass

class DraftResponse(DraftBase):
    id: int
    image_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisResponse(BaseModel):
    title: str
    description: str
    category: str
    condition: str
    price: float
