from pydantic import BaseModel, ConfigDict, Field


class StorageUnitCreate(BaseModel):
  name: str = Field(max_length=50)
  capacity: float


class StorageUnit(StorageUnitCreate):
  model_config = ConfigDict(from_attributes=True)

  id: int
