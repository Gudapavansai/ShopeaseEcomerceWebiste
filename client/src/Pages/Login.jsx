import React, { useState, useContext, useEffect } from 'react'

import { authAPI } from '../services/api'
import ErrorHandler from '../utils/errorHandler'
import Validators from '../utils/validators'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Login = () => {

  const { token, setToken, navigate } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState('Sign Up');
  const [loading, setLoading] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (currentState === 'Sign Up') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!Validators.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate before submit
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let result;

      if (currentState === 'Sign Up') {
        // Sign up
        result = await authAPI.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        toast.success('Account created successfully! Please login.');
        // Clear form and switch to login
        setFormData({ name: '', email: '', password: '' });
        setCurrentState('Login');
      } else {
        // Login
        result = await authAPI.login({
          email: formData.email,
          password: formData.password
        });

        // Store token and user info
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('userId', result.user.id);
        
        // Update context state
        setToken(result.token);

        toast.success(`Welcome back, ${result.user.name}!`);

        // Clear form
        setFormData({ name: '', email: '', password: '' });
        setErrors({});

        // Redirect is handled by the useEffect watching token
      }
    } catch (error) {
      // Handle specific error messages
      if (error.message.includes('already exists')) {
        setErrors({ email: 'Email already registered. Please login.' });
      } else if (error.message.includes('not found') || error.message.includes('Invalid')) {
        setErrors({ email: 'Invalid email or password' });
      } else {
        ErrorHandler.handle(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Login' ? '' : (
        <div className='w-full'>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-800'}`} 
            placeholder='Name' 
          />
          {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
        </div>
      )}

      <div className='w-full'>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-800'}`} 
          placeholder='Email' 
        />
        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
      </div>

      <div className='w-full'>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-800'}`} 
          placeholder='Password' 
        />
        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password}</p>}
      </div>

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer hover:text-gray-600'>Forgot your password?</p>
        {
          currentState === 'Login'
            ? <p onClick={() => {
              setCurrentState('Sign Up');
              setErrors({});
              setFormData({ name: '', email: '', password: '' });
            }} className='cursor-pointer hover:text-gray-600'>Create account</p>
            : <p onClick={() => {
              setCurrentState('Login');
              setErrors({});
              setFormData({ name: '', email: '', password: '' });
            }} className='cursor-pointer hover:text-gray-600'>Login Here</p>
        }
      </div>

      <button 
        type="submit"
        disabled={loading}
        className='bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'>
        {loading ? 'Processing...' : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  )
}
export default Login
