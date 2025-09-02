import React from 'react';

const SystemRequirements = () => {
  const requirements = [
    { name: 'Browser Compatibility', met: true },
    { name: 'Internet Connection', met: navigator.onLine },
    { name: 'JavaScript Enabled', met: true },
    { name: 'Screen Resolution', met: window.screen.width >= 1024 && window.screen.height >= 768 },
  ];

  return (
    <div>
      <h3>System Requirements</h3>
      <ul>
        {requirements.map((req, index) => (
          <li key={index}>
            {req.name}: {req.met ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemRequirements;
