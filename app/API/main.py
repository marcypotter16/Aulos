from fastapi import FastAPI
from db.database import Base, engine
from routers import search, users, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Middleware to handle CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for now (okay for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users.router)
app.include_router(search.router)
app.include_router(auth.router)
