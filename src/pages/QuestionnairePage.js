import React from 'react';
import { Link } from 'react-router-dom';

function QuestionnairePage() {
  return (
    <div>
      <h1>Questionnaire Page</h1>
      <button>
        <Link to="/register">Go to Register</Link>
      </button>
      <button>
        <Link to="/home">Go to Home</Link>
      </button>
    </div>
  );
}

export default QuestionnairePage;
