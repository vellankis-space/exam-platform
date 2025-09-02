# backend/app/routes/exams.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas
from ..database import SessionLocal, Question, ExamSession, UserAnswer
from ..dependencies import get_current_user
import random

# Create a new router
router = APIRouter()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/start", response_model=schemas.ExamStartResponse)
def start_exam(db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """
    Start a new exam session.
    """
    # Get all questions from the database
    questions = db.query(Question).all()
    
    # Randomize the questions
    random.shuffle(questions)
    
    # Get the first 20 questions
    total_questions = 20 # As per PRD
    questions = questions[:total_questions]

    # Create a new exam session
    exam_session = ExamSession(
        user_id=current_user.id,
        total_questions=total_questions,
        duration_minutes=30 # As per PRD
    )
    db.add(exam_session)
    db.commit()
    db.refresh(exam_session)

    return {
        "exam_id": exam_session.id,
        "duration_minutes": exam_session.duration_minutes,
        "total_questions": exam_session.total_questions,
        "questions": questions
    }

@router.post("/submit")
def submit_exam(submit_request: schemas.SubmitRequest, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """
    Submit an exam and calculate the score.
    """
    # Get the exam session from the database
    exam_session = db.query(ExamSession).filter(ExamSession.id == submit_request.exam_id, ExamSession.user_id == current_user.id).first()
    if not exam_session:
        raise HTTPException(status_code=404, detail="Exam session not found")

    # Check if the exam session is active
    if exam_session.status != 'active':
        raise HTTPException(status_code=400, detail="Exam session is not active")

    # Calculate the score
    score = 0
    for answer_data in submit_request.answers:
        question = db.query(Question).filter(Question.id == answer_data.question_id).first()
        if not question:
            continue

        is_correct = question.correct_answer == answer_data.answer
        if is_correct:
            score += 1

        # Save the user's answer
        user_answer = UserAnswer(
            session_id=exam_session.id,
            question_id=answer_data.question_id,
            user_answer=answer_data.answer,
            is_correct=is_correct
        )
        db.add(user_answer)

    # Update the exam session
    exam_session.score = score
    exam_session.status = 'completed'
    db.commit()

    return {"message": "Exam submitted successfully", "score": score}

@router.get("/{exam_id}/results", response_model=schemas.ResultsResponse)
def get_results(exam_id: int, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    """
    Get the results of an exam session.
    """
    # Get the exam session from the database
    exam_session = db.query(ExamSession).filter(ExamSession.id == exam_id, ExamSession.user_id == current_user.id).first()
    if not exam_session:
        raise HTTPException(status_code=404, detail="Exam session not found")

    # Check if the exam is still active
    if exam_session.status == 'active':
        raise HTTPException(status_code=400, detail="Exam is still active")

    # Get the user's answers
    user_answers = db.query(UserAnswer).filter(UserAnswer.session_id == exam_id).all()

    # Prepare the response
    answers = []
    for ua in user_answers:
        question = db.query(Question).filter(Question.id == ua.question_id).first()
        answers.append({
            "question_id": ua.question_id,
            "user_answer": ua.user_answer,
            "is_correct": ua.is_correct,
            "correct_answer": question.correct_answer,
            "question": question
        })

    # Calculate the percentage and check if the user passed
    percentage = (exam_session.score / exam_session.total_questions) * 100
    passed = percentage >= 50 # 50% passing threshold

    return {
        "exam_id": exam_session.id,
        "score": exam_session.score,
        "total_questions": exam_session.total_questions,
        "percentage": percentage,
        "passed": passed,
        "answers": answers
    }
