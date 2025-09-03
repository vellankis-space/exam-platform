import React from 'react';

const Question = ({ question, onAnswerChange }) => {
  return (
    <div>
      <p>{question.question_text}</p>
      <form>
        <input type="radio" name={`question-${question.id}`} value="a" onChange={() => onAnswerChange(question.id, 'a')} /> {question.option_a}
        <input type="radio" name={`question-${question.id}`} value="b" onChange={() => onAnswerChange(question.id, 'b')} /> {question.option_b}
        <input type="radio" name={`question-${question.id}`} value="c" onChange={() => onAnswerChange(question.id, 'c')} /> {question.option_c}
        <input type="radio" name={`question-${question.id}`} value="d" onChange={() => onAnswerChange(question.id, 'd')} /> {question.option_d}
      </form>
    </div>
  );
};

export default Question;
