import os
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

engine = create_async_engine(os.environ["DB_URL"])

SessionLocal = async_sessionmaker(
  bind=engine,
  autoflush=False,
  expire_on_commit=False,
)

class Base(DeclarativeBase):
  pass
