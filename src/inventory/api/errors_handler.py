import logging
import uuid

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from inventory.errors import ApplicationError


logger = logging.getLogger(__name__)

def _request_id(request: Request) -> str:
  return getattr(request, "request_id", str(uuid.uuid4()))

def register_exception_handler(app: FastAPI) -> None:
  @app.exception_handler(ApplicationError)
  async def handle_application_error(request: Request, exception: ApplicationError) -> JSONResponse:
    request_id = _request_id(request)
    logger.warning(
      "Application error: code=%s request_id=%s path=%s",
      exception.code,
      request_id,
      request.url.path,
    )
    return JSONResponse(
      status_code=exception.status_code,
      content={
        "code": exception.code, 
        "message": exception.message,
        "request_id": request_id,
      },
      headers={
        "X-Request-ID": request_id
      }
    )
