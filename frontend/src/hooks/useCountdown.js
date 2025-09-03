import { useState, useEffect } from 'react';

/**
 * A custom hook to implement a countdown timer.
 * @param {number} initialTime - The initial time for the countdown in seconds.
 * @param {Function} onTimeout - The function to call when the timer reaches zero.
 * @returns {number} The time left in seconds.
 */
const useCountdown = (initialTime, onTimeout) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  return timeLeft;
};

export default useCountdown;
