from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from inventory.db.database import Base


class StorageUnit(Base):
  __tablename__ = "storage_units"

  id: Mapped[int] = mapped_column(
    Integer,
    primary_key=True,
  )
  name: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
  )
  capacity: Mapped[float] = mapped_column(
    Float,
    nullable=False,
  )
  movies: Mapped[list["Movie"]] = relationship(back_populates="storage_unit")
  series: Mapped[list["Serie"]] = relationship(back_populates="storage_unit")