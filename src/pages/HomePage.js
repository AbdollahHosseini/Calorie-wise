import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <button>
        <Link to="/">Go to Login</Link>
      </button>
      <button>
        <Link to="/questionnaire">Go to Questionnaire</Link>
      </button>
    </div>
  );
}

export default HomePage;
