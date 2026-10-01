from collections.abc import Sequence

from inventory.models.game import Game
from inventory.repositories.games import GameRepository
from inventory.schemas.game import GameCreate


class GameService:
  def __init__(self, repository: GameRepository):
    self.repository = repository

  async def list(self) -> Sequence[Game]:
    return await self.repository.list()

  async def create(self, game: GameCreate) -> Game:
    return await self.repository.create(
      Game(**game.model_dump())
    )
    