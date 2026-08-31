from pydantic import BaseModel, ConfigDict, Field


class MovieCreate(BaseModel):
  title: str = Field(max_length=100)
  year: int | None = None
  storage_unit_id: int | None = None


class Movie(MovieCreate):
  model_config = ConfigDict(from_attributes=True)

  id: int
