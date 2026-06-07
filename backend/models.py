from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class Draft(Base):
    __tablename__ = "drafts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    condition = Column(String, nullable=True)
    price = Column(Float, nullable=True)
    image_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
