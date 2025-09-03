import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import Timer from '../components/Timer';
import Question from '../components/Question';
import ProgressTracker from '../components/ProgressTracker';

/**
 * The main component for the exam-taking interface.
 * It manages the exam state, including questions, answers, and the timer.
 * @returns {JSX.Element}
 */
const Exam = () => {
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Effect to start the exam or load from localStorage
  useEffect(() => {
    const startExam = async () => {
      try {
        const savedState = JSON.parse(localStorage.getItem('examState'));
        if (savedState) {
          setExam(savedState.exam);
          setAnswers(savedState.answers);
          setCurrentQuestionIndex(savedState.currentQuestionIndex);
        } else {
          const response = await api.get('/exams/start');
          setExam(response.data);
        }
      } catch (err) {
        setError('Failed to start the exam.');
      }
    };

    startExam();
  }, []);

  // Effect to save the exam state to localStorage
  useEffect(() => {
    if (exam) {
      const examState = {
        exam,
        answers,
        currentQuestionIndex,
      };
      localStorage.setItem('examState', JSON.stringify(examState));
    }
  }, [exam, answers, currentQuestionIndex]);

  /**
   * Handles changes to the answer of a question.
   * @param {number} questionId - The ID of the question.
   * @param {string} answer - The selected answer.
   */
  const handleAnswerChange = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
  };

  // Effect to auto-save answers to the backend
  useEffect(() => {
    if (exam && Object.keys(answers).length > 0) {
      const saveAnswers = async () => {
        setIsSaving(true);
        setSaveError(null);
        try {
          await api.post(`/exams/${exam.exam_id}/answer`, {
            question_id: Object.keys(answers).pop(),
            answer: Object.values(answers).pop(),
          });
        } catch (err) {
          setSaveError('Failed to save your answer. Please check your connection.');
        } finally {
          setIsSaving(false);
        }
      };
      saveAnswers();
    }
  }, [answers, exam]);

  /**
   * Handles the submission of the exam.
   */
  const handleSubmit = async () => {
    try {
      const response = await api.post('/exams/submit', {
        exam_id: exam.exam_id,
        answers: Object.keys(answers).map(questionId => ({
          question_id: parseInt(questionId),
          answer: answers[questionId],
        })),
      });
      localStorage.removeItem('examState');
      navigate(`/results?score=${response.data.score}`);
    } catch (err) {
      setError('Failed to submit the exam.');
    }
  };

  /**
   * Navigates to the next question.
   */
  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  /**
   * Navigates to the previous question.
   */
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * Navigates to a specific question.
   * @param {number} index - The index of the question to navigate to.
   */
  const handleNavigate = (index) => {
    setCurrentQuestionIndex(index);
    setShowNav(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!exam) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Exam</h2>
      <Timer initialTime={exam.duration_minutes * 60} onTimeout={handleSubmit} />
      {isSaving && <p>Saving...</p>}
      {saveError && <p style={{ color: 'red' }}>{saveError}</p>}

      <div className="mobile-nav">
        <button onClick={() => setShowNav(!showNav)}>Toggle Navigation</button>
      </div>

      <div className={`progress-tracker-container ${showNav ? 'show' : ''}`}>
        <ProgressTracker current={currentQuestionIndex} questions={exam.questions} onNavigate={handleNavigate} answers={answers} />
      </div>

      <Question
        question={exam.questions[currentQuestionIndex]}
        onAnswerChange={handleAnswerChange}
      />
      <div>
        <button onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</button>
        <button onClick={handleNext} disabled={currentQuestionIndex === exam.questions.length - 1}>Next</button>
        {currentQuestionIndex === exam.questions.length - 1 && (
          <button onClick={handleSubmit}>Submit Exam</button>
        )}
      </div>
    </div>
  );
};

export default Exam;
