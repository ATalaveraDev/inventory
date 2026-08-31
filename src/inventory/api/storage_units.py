from fastapi import APIRouter

from inventory.db.database import SessionLocal
from inventory.repositories.storage_units import StorageUnitRepository
from inventory.schemas.storage_unit import StorageUnit, StorageUnitCreate
from inventory.services.storage_unit import StorageUnitService


storage_units_router = APIRouter()

@storage_units_router.get("/")
async def list_storage_units() -> list[StorageUnit]:
  async with SessionLocal() as session:
    service = StorageUnitService(
      repository=StorageUnitRepository(session)
    )
    return await service.list()

@storage_units_router.post("/")
async def create(storage_unit: StorageUnitCreate) -> StorageUnit:
  async with SessionLocal() as session:
    service = StorageUnitService(
      repository=StorageUnitRepository(session)
    )
    return await service.create(storage_unit)
