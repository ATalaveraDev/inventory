from fastapi import APIRouter
from inventory.api.movies import movies_router
from inventory.api.storage_units import storage_units_router

router = APIRouter()

router.include_router(
  movies_router,
  prefix="/movies",
  tags=["creation"],
)

router.include_router(
  storage_units_router,
  prefix="/storage_units",
  tags=["creation"],
)