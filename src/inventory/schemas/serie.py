from pydantic import BaseModel, ConfigDict, Field


class SerieCreate(BaseModel):
  title: str = Field(max_length=100)
  year: int | None = None
  storage_unit_id: int | None = None

class Serie(SerieCreate):
  model_config = ConfigDict(from_attributes=True)

  id: int