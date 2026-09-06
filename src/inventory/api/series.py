from fastapi import APIRouter

from inventory.db.database import SessionLocal
from inventory.repositories.series import SeriesRepository
from inventory.schemas.serie import Serie, SerieCreate
from inventory.services.serie import SerieService


series_router = APIRouter()

@series_router.get("/")
async def list_series() -> list[Serie]:
  async with SessionLocal() as session:
    service = SerieService(
      repository=SeriesRepository(session)
    )
    return await service.list()

@series_router.post("/")
async def create(serie: SerieCreate) -> Serie:
  async with SessionLocal() as session:
    service = SerieService(
      repository=SeriesRepository(session)
    )
    return await service.create(serie)