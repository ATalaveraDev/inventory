from inventory.repositories.storage_units import StorageUnitRepository

class StorageUnitService:
  def __init__(self, repository: StorageUnitRepository):
    self.repository = repository

  async def create(self, storage_unit):
    return self.repository.create(storage_unit)