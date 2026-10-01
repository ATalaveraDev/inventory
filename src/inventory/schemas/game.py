from pydantic import BaseModel, ConfigDict, Field


class GameCreate(BaseModel):
  title: str = Field(max_length=100)
  year: int | None = None
  storage_unit_id: int | None = None
  platform: str

class Game(GameCreate):
  model_config = ConfigDict(from_attributes=True)

  id: int