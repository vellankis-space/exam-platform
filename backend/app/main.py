# main.py

from fastapi import FastAPI
from .routes import auth, users, exams

# Create a FastAPI instance
app = FastAPI()

# Include the authentication, users, and exams routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(exams.router, prefix="/api/v1/exams", tags=["exams"])

# Define a root endpoint
@app.get("/")
def read_root():
    """
    Root endpoint to check if the API is running.
    """
    return {"Hello": "World"}
