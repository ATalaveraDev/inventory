import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.environ["DB_URL"])

SessionLocal = sessionmaker(
  bind=engine,
  autoflush=False,
  autocommit=False,
)

class Base(DeclarativeBase):
  pass
