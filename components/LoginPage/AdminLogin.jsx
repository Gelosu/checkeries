import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const AdminLogin = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const handleAdminLogin = async (event) => {
    event.preventDefault();
    const adminName = event.target.elements.ADMINNAME.value;

    const passWord = event.target.elements.PASSWORD.value;
    // Log the adminName for development purposes only
    console.log('Admin Name:', adminName);
    try {
      const response = await axios.post('http://localhost:3001/adminlogin', {
        adminName,
        passWord,
      });
      const isAuthenticated = response.data.isAuthenticated;
      if (isAuthenticated) {
        console.log('Login successful');
        router.push('/adminpage');
      } else {
        setError('Invalid admin name');
        console.log('Invalid admin name');
        
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
        router.push('/login'); // Redirect back to the login page
      }, 3000); // Redirect after 3 seconds
    }
  }, [error, router]);
  return (
    <main className="container vh-100 d-flex justify-content-center align-items-center">
      <section className="col-lg-5 d-flex justify-content-center align-items-center flex-column border border-dark h-50 rounded-3">
        <form className="d-flex justify-content-center align-items-center flex-column col-12" onSubmit={handleAdminLogin}>
          <p className="mb-0 mb-3">ADMIN NAME</p>
          <input type="text" className="py-1 px-3 w-75 rounded border border-dark mb-3 text-center" name="ADMINNAME" />
          <input type='text' className='py-1 px-3 w-75 rounded border border-dark mb-4 text-center' name='PASSWORD'/>
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