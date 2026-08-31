import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from inventory.api.router import router
from inventory.api.errors_handler import register_exception_handler


load_dotenv()

app = FastAPI()

origins = [
  origin.strip()
  for origin in os.environ["CORS_ALLOW_ORIGINS"].split(",")
  if origin.strip()
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(router)

register_exception_handler(app)


class SpaStaticFiles(StaticFiles):
  """Static files that fall back to index.html so Angular can own its routes.

  Without this a refresh on a client-side route such as /movies would 404:
  StaticFiles only serves index.html for directory requests.
  """

  async def get_response(self, path: str, scope):
    try:
      return await super().get_response(path, scope)
    except StarletteHTTPException as exc:
      if exc.status_code == 404:
        return await super().get_response("index.html", scope)
      raise


# Serve the built Angular app, when present. Mounted last so it never shadows
# /api, /docs or /openapi.json. In development `ng serve` proxies to this app
# instead, so the bundle is only built for production.
UI_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist" / "inventory-ui" / "browser"

if UI_DIST.is_dir():
  app.mount("/", SpaStaticFiles(directory=UI_DIST, html=True), name="ui")
