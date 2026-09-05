from collections.abc import Sequence

from inventory.models.movie import Movie
from inventory.repositories.movies import MovieRepository


class MovieService:
  def __init__(self, repository: MovieRepository):
    self.repository = repository

  async def create(self, movie) -> Movie:
    return self.repository.create(movie)

  async def list(self) -> Sequence[Movie]:
    return await self.repository.list()