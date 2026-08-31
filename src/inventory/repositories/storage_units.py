from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from inventory.models.storage_units import StorageUnit


class StorageUnitRepository:
  def __init__(self, session: AsyncSession):
    self.session = session

  async def create(self, storage_unit: StorageUnit) -> StorageUnit:
    self.session.add(storage_unit)
    await self.session.flush()
    await self.session.commit()
    return storage_unit

  async def list(self) -> Sequence[StorageUnit]:
    result = await self.session.scalars(
      select(StorageUnit).order_by(StorageUnit.name)
    )
    return result.all()
