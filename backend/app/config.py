import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/exam_platform")
