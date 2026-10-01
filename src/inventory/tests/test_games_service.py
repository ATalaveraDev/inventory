import asyncio
from unittest.mock import create_autospec, sentinel

from inventory.models.game import Game
from inventory.repositories.games import GameRepository
from inventory.schemas.game import GameCreate
from inventory.services.game import GameService


def test_list_calls_repository_list():
  repository = create_autospec(
    GameRepository,
    instance=True,
    spec_set=True,
  )
  games = [sentinel.game_a, sentinel.game_b]
  service = GameService(repository)
  repository.list.return_value = games
  result = asyncio.run(service.list())
  repository.list.assert_awaited_once()

  assert result == games

def test_create_calls_repository_create():
  repository = create_autospec(
    GameRepository,
    instance=True,
    spec_set=True,
  )
  game = GameCreate(title="Yakuza 4", platform="PC")
  repository.create.return_value = sentinel.created_game
  service = GameService(repository)
  
  result = asyncio.run(service.create(game))

  repository.create.assert_awaited_once()
  created_game = repository.create.await_args.args[0]

  assert isinstance(created_game, Game)
  assert created_game.title == game.title
  assert created_game.platform == game.platform
  assert result is sentinel.created_game