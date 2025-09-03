import React from 'react';

/**
 * A component to display the progress of the exam and allow navigation between questions.
 * @param {object} props - The component props.
 * @param {number} props.current - The index of the current question.
 * @param {Array} props.questions - The list of questions in the exam.
 * @param {Function} props.onNavigate - The function to call when a question is selected.
 * @param {object} props.answers - The user's answers to the questions.
 * @returns {JSX.Element}
 */
const ProgressTracker = ({ current, questions, onNavigate, answers }) => {

  /**
   * Determines the status of a question (current, answered, or unanswered).
   * @param {number} questionId - The ID of the question.
   * @returns {string} The status of the question.
   */
  const getStatus = (questionId) => {
    if (questions[current].id === questionId) {
      return 'current';
    }
    if (answers[questionId]) {
      return 'answered';
    }
    return 'unanswered';
  };

  return (
    <div>
      <h3>Question Progress</h3>
      <p>{`Question ${current + 1} of ${questions.length}`}</p>
      <div>
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => onNavigate(index)}
            style={{
              fontWeight: getStatus(q.id) === 'current' ? 'bold' : 'normal',
              backgroundColor: getStatus(q.id) === 'answered' ? 'lightgreen' : 'white',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
