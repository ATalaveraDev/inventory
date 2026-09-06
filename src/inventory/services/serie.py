from collections.abc import Sequence

from inventory.models.serie import Serie
from inventory.repositories.series import SeriesRepository
from inventory.schemas.serie import SerieCreate


class SerieService:
  def __init__(self, repository: SeriesRepository):
    self.repository = repository

  async def create(self, serie: SerieCreate) -> Serie:
    return await self.repository.create(
      Serie(**serie.model_dump())
    )

  async def list(self) -> Sequence[Serie]:
    return await self.repository.list()