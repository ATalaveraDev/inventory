import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from inventory.api.errors_handler import register_exception_handler


app = FastAPI()

origins = os.environ["CORS_ALLOW_ORIGINS"]
app.add_middleware(
  CORSMiddleware,
  allow_orings=origins,
  allow_methods=["POST"],
)

register_exception_handler(app)