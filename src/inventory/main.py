import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
  allow_methods=["POST"],
)

app.include_router(router)

register_exception_handler(app)
