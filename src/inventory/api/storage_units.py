from fastapi import APIRouter

from inventory.db.database import SessionLocal
from inventory.repositories.storage_units import StorageUnitRepository
from inventory.services.storage_unit import StorageUnitService


storage_units_router = APIRouter()

@storage_units_router.post("/")
async def create(storage_unit):
  async with SessionLocal() as session:
    service = StorageUnitService(
      repository=StorageUnitRepository(session)
    )
    return service.create(storage_unit)