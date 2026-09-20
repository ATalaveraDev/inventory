from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from inventory.models.game import Game

class GameRepository:
  def __init__(self, session: AsyncSession):
    self.session = session

  async def create(self, game: Game):
    self.session.add(game)
    await self.session.flush()
    await self.session.commit()
    return game

  async def list(self) -> Sequence[Game]:
    result = await self.session.scalars(
      select(Game).order_by(Game.title)
    )
    return result.all()