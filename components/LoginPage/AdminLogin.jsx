"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    const ADMINNAME = event.target.elements.ADMINNAME.value;
    const PASSWORD = event.target.elements.PASSWORD.value;
    // Log the adminName for development purposes only
    console.log('Admin Name:', ADMINNAME);
    console.log('pass:', PASSWORD);

    try {
      const response = await axios.post('http://localhost:3001/adminlogin', {
        ADMINNAME,
        PASSWORD,
      });

      const isAuthenticated = response.data.isAuthenticated;
      if (isAuthenticated) {
        console.log('Login successful');
        router.push('/adminpage');
      } else {
        setError('Invalid admin name or password');
        console.log('Invalid admin name or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Error during login:', error);
    }
  };

  // useEffect to handle errors and redirect to login page
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000); // Clear the error after 3 seconds
    }
  }, [error]);

  return (
    <main className="container vh-100 d-flex justify-content-center align-items-center">
      <section className="col-lg-5 d-flex justify-content-center align-items-center flex-column border border-dark h-50 rounded-3">
        <form className="d-flex justify-content-center align-items-center flex-column col-12" onSubmit={handleAdminLogin}>
          <p className="mb-0 mb-3">ADMIN NAME</p>
          <input type="text" className="py-1 px-3 w-75 rounded border border-dark mb-3 text-center" name="ADMINNAME" />
          <input type='password' className='py-1 px-3 w-75 rounded border border-dark mb-4 text-center' name='PASSWORD'/>
          {error && <small className="mb-2 text-danger">{error}</small>} {/* Display error message */}
          <button type="submit" className="px-3 mb-3 btn btn-outline-dark">
            LOGIN
          </button>
        </form>
      </section>
    </main>
  );
};

export default AdminLogin;