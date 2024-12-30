/* eslint-disable no-empty */
import { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
  const [state, setState] = useState('Admin'); // Tracks login type (Admin/Doctor)
  const [email, setEmail] = useState(''); // Tracks email input
  const [password, setPassword] = useState(''); // Tracks password input
  const { setAToken, backendUrl } = useContext(AdminContext); // Admin token context and backend URL
  const { setDToken } = useContext(DoctorContext); // Doctor token context

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent form default submission behavior

    try {
      // Check if backendUrl is configured
      if (!backendUrl) {
        toast.error('Backend URL is not configured');
        return;
      }

      // Determine the login API endpoint based on the state
      const url =
        state === 'Admin'
          ? `${backendUrl}/api/admin/login`
          : `${backendUrl}/api/doctor/login`;

      // Make the login API request
      const { data } = await axios.post(url, { email, password });

      // Handle success response
      if (data.success) {
        const tokenType = state === 'Admin' ? 'aToken' : 'dToken';
        localStorage.setItem(tokenType, data.token); // Store token in local storage

        if (state === 'Admin') {
          setAToken(data.token); // Update Admin token context
        } else {
          setDToken(data.token); // Update Doctor token context
        }

        toast.success(`${state} logged in successfully!`);
      } else {
        // Handle failure response
        toast.error(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Backend URL:', backendUrl);
      console.error('Error response:', error.response);

      // Display error message
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-600 text-sm shadow-lg">
        <p className="m-auto text-2xl font-semibold">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full p-2 mt-1 border border-gray-300 rounded"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 text-base text-white rounded-md bg-primary hover:bg-primary-dark"
        >
          Login
        </button>

        {state === 'Admin' ? (
          <p>
            Doctor Login?{' '}
            <span
              className="text-xs underline cursor-pointer text-primary"
              onClick={() => setState('Doctor')}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{' '}
            <span
              className="text-xs underline cursor-pointer text-primary"
              onClick={() => setState('Admin')}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
