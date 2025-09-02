from pydantic import BaseModel
from typing import Optional, List

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    student_id: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    student_id: Optional[str] = None

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenData(BaseModel):
    email: Optional[str] = None

class QuestionResponse(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        orm_mode = True

class ExamStartResponse(BaseModel):
    exam_id: int
    duration_minutes: int
    total_questions: int
    questions: List[QuestionResponse]

class Answer(BaseModel):
    question_id: int
    answer: str

class SubmitRequest(BaseModel):
    exam_id: int
    answers: List[Answer]

class UserAnswerResponse(BaseModel):
    question_id: int
    user_answer: str
    is_correct: bool
    correct_answer: str
    question: QuestionResponse

    class Config:
        orm_mode = True

class ResultsResponse(BaseModel):
    exam_id: int
    score: int
    total_questions: int
    percentage: float
    passed: bool
    answers: List[UserAnswerResponse]

    class Config:
        orm_mode = True
