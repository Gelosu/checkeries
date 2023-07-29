"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const MatchCode = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [TUPCID, setTUPCID] = useState('');

  useEffect(() => {
    // Check if the router.query object exists and if TUPCID is available
    if (router.query.TUPCID) {
      setTUPCID(router.query.TUPCID);
    } else {
      // If TUPCID is not available, handle the error or redirect to another page
      // For example, you can redirect to the ForgotPassword page if TUPCID is not available
      router.push('/login/ForgetPassword');
    }
  }, [router.query.TUPCID]);

  const handleCodeMatch = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to the backend to match the code
      const response = await axios.post('http://localhost:3001/matchcode', {
        TUPCID: TUPCID,
        code: code,
      });

      // Assuming the server returns a JSON object with a 'status' field
      if (response.data.status === 'success') {
        // If the code matches, redirect to the UpdatePassword page
        router.push('/login/ForgetPassword/UpdatePassword');
      } else {
        setError('Invalid code. Please check the code and try again.');
      }
    } catch (error) {
      // Handle the error if there is a network issue or other server errors
      setError('An error occurred. Please try again later.');
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
