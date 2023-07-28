import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export default function Login() {
  const [error, setError] = useState('');
  const router = useRouter();
  const tupcRegExp = /TUPC-\d{2}-\d{4}$/;
  const [showPassword, setShowPassword] = useState(false); // State variable for password visibility

  const handleAdminLinkClick = () => {
    router.push('/adminlogin'); // Redirect to the admin login page
  };

  const schema = yup.object().shape({
    TUPCID: yup.string().matches(tupcRegExp, 'Invalid TUPC-ID!').required('TUPC-ID Required!'),
    PASSWORD: yup.string().required('Password Required!'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = async (data) => {
    console.log(data);
    const { TUPCID, PASSWORD } = data;
    
  
    try {
      const response = await axios.post('http://localhost:3001/login', data);
      console.log('Response from server:', response.data);
      const accountType = response.data.accountType;
      console.log('Received account type:', accountType);
  
      if (accountType === 'student') {
        console.log('Redirect to student page');
        router.push('/Classroom/S');
      } else if (accountType === 'faculty') {
        console.log('Redirect to faculty page');
        router.push('/Classroom/F');
      
      } else {
        setError('Account does not exist');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Password is incorrect');
      } else if (error.response && error.response.status === 404) {
        setError('Account does not exist');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <main className="container vh-100 d-flex justify-content-center align-items-center">
      <section className="col-lg-5 py-5 d-flex justify-content-center align-items-center flex-column border border-dark h-50 rounded-3">
        <form
          className="d-flex justify-content-center align-items-center flex-column col-12"
          onSubmit={handleSubmit(submitForm)}
        >
          <p className="mb-0 mt-3">TUPC ID</p>
          <input
            type="text"
            className="py-1 px-3 w-75 rounded border border-dark mb-1 text-center"
            placeholder="TUPC-**-****"
            {...register('TUPCID')}
          />
          <small className="mb-2 text-danger">{errors.TUPCID?.message}</small>
          <p className="mb-0">PASSWORD</p>
          <div className="input-group mb-1 w-75">
            <input
              type={showPassword ? 'text' : 'password'} // Use 'text' when showPassword is true, otherwise use 'password'
              className="py-1 px-3 rounded border border-dark text-center form-control"
              {...register('PASSWORD')}
            />
            <button
              type="button"
              className="btn btn-outline-secondary" // Style the button as needed
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility when the button is clicked
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <small className="mb-2 text-danger">{errors.PASSWORD?.message}</small>
          {error && <small className="mb-2 text-danger">{error}</small>} {/* Display error message */}
          <button type="submit" className="px-3 mb-3 btn btn-outline-dark">
            LOGIN
          </button>
        </form>
        <a
          type="button"
          className="link-primary mb-3 btn btn-link text-decoration-none"
          onClick={handleAdminLinkClick}
        >
          Are you an admin? Click here
        </a>
        <a className="link-primary mb-3 text-decoration-none" href="/login/ForgetPassword">
          Forgot Password?
        </a>
        <p className="text-center px-lg-2 px-4">
          Don't have an account yet?
          <a className="primary-link text-decoration-none" href="/login/Register">
            Register Now
          </a>
        </p>
      </section>
    </main>
  );
}
