import React from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      <button>
        <Link to="/home">Go to Home</Link>
      </button>
      <button>
        <Link to="/register">Go to Register</Link>
      </button>
    </div>
  );
}

export default LoginPage;
