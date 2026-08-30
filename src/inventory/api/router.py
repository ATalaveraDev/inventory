from fastapi import APIRouter
from inventory.api.movies import movies_router

router = APIRouter()

router.include_router(
  movies_router,
  prefix="/create",
  tags=["creation"],
)