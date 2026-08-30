from fastapi import APIRouter
from inventory.schemas.movie import Movie
from inventory.repositories.movies import MovieRepository
from inventory.services.movie import MovieService


movies_router = APIRouter()

@movies_router.post("/")
async def post_movie(movie) -> Movie:
  service = MovieService(
    repository=MovieRepository()
  )
  return service.create(movie)