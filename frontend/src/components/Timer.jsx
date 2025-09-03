import React from 'react';
import useCountdown from '../hooks/useCountdown';

import React from 'react';
import useCountdown from '../hooks/useCountdown';

/**
 * A component to display a countdown timer for the exam.
 * @param {object} props - The component props.
 * @param {number} props.initialTime - The initial time for the countdown in seconds.
 * @param {Function} props.onTimeout - The function to call when the timer reaches zero.
 * @returns {JSX.Element}
 */
const Timer = ({ initialTime, onTimeout }) => {
  const timeLeft = useCountdown(initialTime, onTimeout);

  /**
   * Formats the time in seconds to a mm:ss format.
   * @param {number} seconds - The time in seconds.
   * @returns {string} The formatted time.
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isWarning = timeLeft < 60;

  return (
    <div style={{ color: isWarning ? 'red' : 'black' }}>
      <h2>Time Left: {formatTime(timeLeft)}</h2>
    </div>
  );
};

export default Timer;


export default Timer;
