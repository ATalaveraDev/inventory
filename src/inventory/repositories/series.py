from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from inventory.models.serie import Serie


class SeriesRepository:
  def __init__(self, session: AsyncSession):
    self.session = session

  async def create(self, serie: Serie) -> Serie:
    self.session.add(serie)
    await self.session.flush()
    await self.session.commit()
    return serie

  async def list(self) -> Sequence[Serie]:
    result = await self.session.scalars(
      select(Serie).order_by(Serie.title)
    )
    return result.all()
