from pydantic import BaseModel, ConfigDict


class Movie(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: str
  title: str
  year: int
  storage_unit_id: int