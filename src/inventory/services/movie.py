from inventory.repositories.movies import MovieRepository


class MovieService:
  def __init__(self, repository: MovieRepository):
    self.repository = repository

  async def create(self, movie) -> Movie:
    return self.repository.create(movie)