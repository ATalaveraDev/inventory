import asyncio
from unittest.mock import MagicMock, create_autospec, sentinel

from sqlalchemy import ScalarResult, select
from sqlalchemy.ext.asyncio import AsyncSession

from inventory.models.game import Game
from inventory.repositories.games import GameRepository


def test_create_adds_flushes_and_commits_game():
  session = create_autospec(
    AsyncSession,
    instance=True,
    spec_set=True,
  )
  game = sentinel.game
  repository = GameRepository(session)

  result = asyncio.run(repository.create(game))
  session.add.assert_called_once_with(game)
  session.flush.assert_awaited_once_with()
  session.commit.assert_awaited_once_with()

  assert result is game

def test_list_requests_games_ordered_by_title():
  session = create_autospec(
    AsyncSession,
    instance=True,
    spec_set=True,
  )
  games = [sentinel.game_a, sentinel.game_b]
  query_result = MagicMock(spec=ScalarResult)
  query_result.all.return_value = games
  session.scalars.return_value = query_result
  repository = GameRepository(session)

  result = asyncio.run(repository.list())

  session.scalars.assert_awaited_once()
  statement = session.scalars.await_args.args[0]
  expected_statement = select(Game).order_by(Game.title)

  assert statement.compare(expected_statement)
  query_result.all.assert_called_once_with()
  assert result == games