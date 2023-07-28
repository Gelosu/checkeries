"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const MatchCode = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeMatch = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to the backend to match the code
      const response = await axios.post('http://localhost:3001/matchcode', {
        code: code,
      });

      // If the code matches, redirect to the UpdatePassword page
      router.push('/updatepassword');
    } catch (error) {
      // Handle the error if the code doesn't match or other server errors
      setError('Invalid code. Please check the code and try again.');
      console.error('Error during code matching:', error);
    }
  };

  return (
    <main className="container vh-100 d-flex justify-content-center align-items-center">
      <section className="col-lg-5 d-flex justify-content-center align-items-center flex-column border border-dark h-50 rounded-3">
        <form className="d-flex justify-content-center align-items-center flex-column col-12" onSubmit={handleCodeMatch}>
          <p className="mb-0 mt-3">Enter the code received in your email</p>
          <input
            type="text"
            className="py-1 px-3 w-75 rounded border border-dark mb-1 text-center"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <small className="mb-2 text-danger">{error}</small>}
          <button type="submit" className="px-3 mb-3 btn btn-outline-dark">
            Match Code
          </button>
        </form>
      </section>
    </main>
  );
};

export default MatchCode;
