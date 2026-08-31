from collections.abc import Sequence

from inventory.models.storage_units import StorageUnit
from inventory.repositories.storage_units import StorageUnitRepository
from inventory.schemas.storage_unit import StorageUnitCreate


class StorageUnitService:
  def __init__(self, repository: StorageUnitRepository):
    self.repository = repository

  async def create(self, storage_unit: StorageUnitCreate) -> StorageUnit:
    return await self.repository.create(
      StorageUnit(**storage_unit.model_dump())
    )

  async def list(self) -> Sequence[StorageUnit]:
    return await self.repository.list()
