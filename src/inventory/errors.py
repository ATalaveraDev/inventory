class ApplicationError(Exception):
  status_code = 500
  code = "internal_error"
  message = "An unexpected error ocurred"

  def __init__(self, message: str | None = None):
    super().__init__(message or self.message)
    if message:
      self.mesage = message