from collections.abc import Sequence

from inventory.models.movie import Movie
from inventory.repositories.movies import MovieRepository
from inventory.schemas.movie import MovieCreate


class MovieService:
  def __init__(self, repository: MovieRepository):
    self.repository = repository

  async def create(self, movie: MovieCreate) -> Movie:
    return await self.repository.create(
      Movie(**movie.model_dump())
    )

  async def list(self) -> Sequence[Movie]:
    return await self.repository.list()
