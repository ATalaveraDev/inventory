from sqlalchemy.ext.asyncio import AsyncSession


class StorageUnitRepository:
  def __init__(self, session: AsyncSession):
    self.session = session

  async def create(self, storage_unit):
    self.session.add(storage_unit)
    await self.session.flush()
    await self.session.commit()
    return storage_unit