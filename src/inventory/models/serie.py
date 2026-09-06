from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from inventory.db.database import Base


class Serie(Base):
  __tablename__ = "series"

  id: Mapped[int] = mapped_column(
    Integer,
    primary_key=True,
  )
  title: Mapped[str] = mapped_column(
    String(100),
    nullable=False,
  )
  year: Mapped[int | None] = mapped_column(
    Integer,
    nullable=True,
  )
  storage_unit_id: Mapped[int | None] = mapped_column(
    Integer,
    ForeignKey("storage_units.id"),
    nullable=True,
  )
  storage_unit: Mapped["StorageUnit | None"] = relationship(back_populates="series")
