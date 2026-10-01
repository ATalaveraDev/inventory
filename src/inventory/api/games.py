from fastapi import APIRouter

from inventory.db.database import SessionLocal
from inventory.repositories.games import GameRepository
from inventory.schemas.game import Game, GameCreate
from inventory.services.game import GameService


games_router = APIRouter()

@games_router.post("/")
async def post_game(game: GameCreate) -> Game:
  async with SessionLocal() as session:
    service = GameService(
      repository=GameRepository(session)
    )
    return await service.create(game=game)

@games_router.get("/")
async def list_games() -> list[Game]:
  async with SessionLocal() as session:
    service = GameService(
      repository=GameRepository(session)
    )
    return await service.list()