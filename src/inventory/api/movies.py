from fastapi import APIRouter
from inventory.db.database import SessionLocal
from inventory.schemas.movie import Movie, MovieCreate
from inventory.repositories.movies import MovieRepository
from inventory.services.movie import MovieService


movies_router = APIRouter()

@movies_router.post("/")
async def post_movie(movie: MovieCreate) -> Movie:
  async with SessionLocal() as session:
    service = MovieService(
      repository=MovieRepository(session)
    )
    return await service.create(movie)

@movies_router.get("/")
async def list_movies() -> list[Movie]:
  async with SessionLocal() as session:
    service = MovieService(
      repository=MovieRepository(session)
    )
    return await service.list()