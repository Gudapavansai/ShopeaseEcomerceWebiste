import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import ErrorHandler from '../utils/errorHandler'
import Validators from '../utils/validators'
import { toast } from 'react-toastify'
import Title from '../components/Title'

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      phone: ''
    }
  });
  const [errors, setErrors] = useState({});

  // Load user from localStorage and fetch full profile
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    if (!token || !userId) {
      navigate('/login');
      return;
    }

    fetchProfile(userId);
  }, [navigate]);

  const fetchProfile = async (userId) => {
    try {
      const result = await authAPI.getProfile(userId);
      // Backend returns { success, user }
      const userData = result.user;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        deliveryAddress: userData.deliveryAddress || {
          firstName: '',
          lastName: '',
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: '',
          phone: ''
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!Validators.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      // Update basic profile and delivery address
      await authAPI.updateProfile(userId, {
        name: formData.name,
        phone: formData.phone,
        // Also save delivery address in same update or separate
        address: formData.deliveryAddress.street // Legacy field
      });

      await authAPI.saveDeliveryAddress(userId, formData.deliveryAddress);

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile(userId); // Refresh
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        deliveryAddress: user.deliveryAddress || {
          firstName: '',
          lastName: '',
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: '',
          phone: ''
        }
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  if (!user) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className='border-t pt-16 transition-opacity duration-500'>
      <div className='text-2xl mb-6'>
        <Title title1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='flex flex-col gap-8 mb-20 max-w-3xl mx-auto'>
        
        {/* Profile Header */}
        <div className='flex items-center justify-between bg-white border p-6 rounded shadow-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-500'>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 uppercase'>{user.name}</h2>
              <p className='text-gray-500 text-sm'>{user.email}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className='border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition'
            >
              EDIT PROFILE
            </button>
          )}
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-white border p-8 rounded shadow-sm'>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Name */}
              <div>
                <label className='block text-gray-600 text-xs font-bold uppercase mb-2'>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                />
              </div>

              {/* Email */}
              <div>
                <label className='block text-gray-600 text-xs font-bold uppercase mb-2'>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className='w-full px-4 py-2 border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                />
              </div>
            </div>

            <hr />
            
            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-4'>DELIVERY ADDRESS</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input
                  type="text"
                  name="deliveryAddress.firstName"
                  value={formData.deliveryAddress.firstName}
                  onChange={handleInputChange}
                  placeholder='First Name'
                  className='w-full px-4 py-2 border border-gray-200'
                />
                <input
                  type="text"
                  name="deliveryAddress.lastName"
                  value={formData.deliveryAddress.lastName}
                  onChange={handleInputChange}
                  placeholder='Last Name'
                  className='w-full px-4 py-2 border border-gray-200'
                />
                <input
                  type="text"
                  name="deliveryAddress.street"
                  value={formData.deliveryAddress.street}
                  onChange={handleInputChange}
                  placeholder='Street'
                  className='w-full px-4 py-2 border border-gray-200 md:col-span-2'
                />
                <input
                  type="text"
                  name="deliveryAddress.city"
                  value={formData.deliveryAddress.city}
                  onChange={handleInputChange}
                  placeholder='City'
                  className='w-full px-4 py-2 border border-gray-200'
                />
                <input
                  type="text"
                  name="deliveryAddress.state"
                  value={formData.deliveryAddress.state}
                  onChange={handleInputChange}
                  placeholder='State'
                  className='w-full px-4 py-2 border border-gray-200'
                />
                <input
                  type="text"
                  name="deliveryAddress.zipcode"
                  value={formData.deliveryAddress.zipcode}
                  onChange={handleInputChange}
                  placeholder='Zipcode'
                  className='w-full px-4 py-2 border border-gray-200'
                />
                <input
                  type="text"
                  name="deliveryAddress.country"
                  value={formData.deliveryAddress.country}
                  onChange={handleInputChange}
                  placeholder='Country'
                  className='w-full px-4 py-2 border border-gray-200'
                />
                <input
                  type="text"
                  name="deliveryAddress.phone"
                  value={formData.deliveryAddress.phone}
                  onChange={handleInputChange}
                  placeholder='Phone'
                  className='w-full px-4 py-2 border border-gray-200 md:col-span-2'
                />
              </div>
            </div>

            {/* Buttons */}
            <div className='flex gap-4 mt-6'>
              <button
                type="submit"
                disabled={loading}
                className='flex-1 bg-black text-white py-3 font-medium hover:bg-gray-800 transition disabled:opacity-50'
              >
                {loading ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className='flex-1 border border-gray-200 text-gray-600 py-3 font-medium hover:bg-gray-50 transition'
              >
                CANCEL
              </button>
            </div>

          </form>
        ) : (
          // Display Mode
          <div className='bg-white border p-8 rounded shadow-sm flex flex-col gap-8'>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <p className='text-gray-400 text-xs font-bold uppercase mb-1'>Full Name</p>
                <p className='text-lg font-medium text-gray-800'>{user.name}</p>
              </div>
              <div>
                <p className='text-gray-400 text-xs font-bold uppercase mb-1'>Email Address</p>
                <p className='text-lg font-medium text-gray-800'>{user.email}</p>
              </div>
            </div>

            <div className='border-t pt-8'>
              <h3 className='text-gray-400 text-xs font-bold uppercase mb-4'>Saved Delivery Address</h3>
              {user.deliveryAddress && user.deliveryAddress.street ? (
                <div className='bg-gray-50 p-6 rounded border border-gray-100'>
                  <p className='font-bold text-gray-800 mb-1'>{user.deliveryAddress.firstName} {user.deliveryAddress.lastName}</p>
                  <p className='text-gray-600'>{user.deliveryAddress.street}</p>
                  <p className='text-gray-600'>{user.deliveryAddress.city}, {user.deliveryAddress.state} {user.deliveryAddress.zipcode}</p>
                  <p className='text-gray-600'>{user.deliveryAddress.country}</p>
                  <p className='mt-2 font-medium text-gray-700'>Ph: {user.deliveryAddress.phone}</p>
                </div>
              ) : (
                <p className='text-gray-500 italic'>No delivery address saved yet. Update your profile or place an order to save one.</p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
