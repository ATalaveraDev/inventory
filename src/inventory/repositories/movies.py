from sqlalchemy.ext.asyncio import AsyncSession


class MovieRepository:
  def __init__(self, session: AsyncSession):
    self.session = session

  async def create(self, movie):
    self.session.add(movie)
    await self.session.flush()
    await self.session.commit()
    return movie
