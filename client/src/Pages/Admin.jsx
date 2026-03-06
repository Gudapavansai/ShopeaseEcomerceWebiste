import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { adminAPI, orderAPI } from '../services/api'
import ErrorHandler from '../utils/errorHandler'
import { toast } from 'react-toastify'
import { assets } from '../assets'
import { FiUploadCloud } from 'react-icons/fi'

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  // Handle Admin Login
  const onAdminLogin = (receivedToken) => {
    localStorage.setItem('adminToken', receivedToken);
    setToken(receivedToken);
    toast.success('Admin Login Success');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    toast.success('Logged out successfully');
    navigate('/admin'); // Stay on admin page but show login
  };

  if (!token) {
    return <AdminLogin setToken={onAdminLogin} />;
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <div className='flex items-center justify-between px-8 py-6 border-b border-gray-200'>
        <div className='flex items-center gap-2'>
          <img src={assets.logo} className="w-10" alt="ShopEase" />
          <div>
            <p className='text-2xl font-bold text-gray-800 uppercase'>ShopEase</p>
            <p className='text-xs text-blue-600 font-medium'>ADMIN PANEL</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className='px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition font-medium'
        >
          Logout
        </button>
      </div>

      <div className='flex'>
        {/* Sidebar */}
        <div className='w-1/4 bg-white border-r border-gray-200 py-6'>
          <nav className='space-y-1 px-4'>
            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                activeTab === 'add'
                  ? 'bg-pink-100 border-2 border-pink-500'
                  : 'border-2 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className='text-lg'>➕</span>
              <span className={activeTab === 'add' ? 'font-bold text-gray-800' : 'text-gray-700'}>Add Items</span>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                activeTab === 'list'
                  ? 'bg-pink-100 border-2 border-pink-500'
                  : 'border-2 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className='text-lg'>☑️</span>
              <span className={activeTab === 'list' ? 'font-bold text-gray-800' : 'text-gray-700'}>List Items</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                activeTab === 'orders'
                  ? 'bg-pink-100 border-2 border-pink-500'
                  : 'border-2 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className='text-lg'>☑️</span>
              <span className={activeTab === 'orders' ? 'font-bold text-gray-800' : 'text-gray-700'}>Orders</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className='w-3/4 p-8 bg-gray-50 min-h-screen'>
          {activeTab === 'add' && <AddProductsTab loading={loading} setLoading={setLoading} />}
          {activeTab === 'list' && <ListProductsTab loading={loading} setLoading={setLoading} />}
          {activeTab === 'orders' && <OrdersTab loading={loading} setLoading={setLoading} />}
        </div>
      </div>
    </div>
  )
}


// ==================== ADD PRODUCTS TAB ====================
const AddProductsTab = ({ loading, setLoading }) => {
  const { getProductsData } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    sizes: [],
    image: ['', '', '', ''],
    bestseller: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...formData.image];
        newImages[index] = reader.result;
        setFormData(prev => ({
          ...prev,
          image: newImages
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty image strings
      const filteredImages = formData.image.filter(img => img.trim() !== '');
      if (filteredImages.length === 0) {
        toast.error('Please upload at least one image');
        setLoading(false);
        return;
      }

      // Generate a simple ID if not present (since backend requires it)
      const submitData = {
        ...formData,
        image: filteredImages,
        _id: formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        price: Number(formData.price)
      };

      await adminAPI.createProduct(submitData);
      await getProductsData(); // Refresh global products state
      toast.success('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Men',
        subCategory: 'Topwear',
        sizes: [],
        image: ['', '', '', ''],
        bestseller: false,
      });
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg'>
      {/* Upload Image */}
      <div className='mb-8'>
        <h3 className='text-lg text-gray-700 mb-4'>Upload Image</h3>
        <div className='flex gap-4'>
          {[0, 1, 2, 3].map((index) => (
            <label key={index} className='relative border-2 border-dashed border-gray-300 w-28 h-28 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all overflow-hidden rounded-md group'>
              {formData.image[index] ? (
                <div className='relative w-full h-full'>
                  <img src={formData.image[index]} alt="" className='w-full h-full object-cover' />
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <p className='text-white text-xs font-medium'>Change</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const newImages = [...formData.image];
                      newImages[index] = '';
                      setFormData(prev => ({ ...prev, image: newImages }));
                    }}
                    className='absolute top-1 right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center z-10 hover:bg-red-600'
                  >✕</button>
                </div>
              ) : (
                <div className='flex flex-col items-center gap-1 text-gray-400 group-hover:text-pink-500'>
                  <FiUploadCloud className='text-3xl' />
                  <p className='text-[10px] font-medium uppercase tracking-tight'>Upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e)}
                className='hidden'
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className='mb-6'>
        <label className='block text-lg text-gray-800 mb-2'>Product name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Type here"
          className='w-full max-w-[400px] px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 text-gray-700'
          required
        />
      </div>

      {/* Product Description */}
      <div className='mb-6'>
        <label className='block text-lg text-gray-800 mb-2'>Product description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Write content here"
          className='w-full max-w-[400px] px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 text-gray-700 resize-none'
          rows="3"
          required
        />
      </div>

      {/* Category, SubCategory, Price */}
      <div className='flex flex-col sm:flex-row gap-8 w-full max-w-[400px] mb-6'>
        <div className='flex-1'>
          <label className='block text-gray-800 mb-2'>Product category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 bg-white'
          >
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </select>
        </div>

        <div className='flex-1'>
          <label className='block text-gray-800 mb-2'>Sub category</label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleInputChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 bg-white'
          >
            <option>Topwear</option>
            <option>Bottomwear</option>
            <option>Winterwear</option>
          </select>
        </div>

        <div className='flex-1'>
          <label className='block text-gray-800 mb-2'>Product Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="25"
            className='w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400'
            required
          />
        </div>
      </div>

      {/* Sizes */}
      <div className='mb-6'>
        <label className='block text-gray-800 mb-2 font-medium'>Product Sizes</label>
        <div className='flex gap-3'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-4 py-1.5 rounded-sm border transition ${
                formData.sizes.includes(size)
                  ? 'bg-pink-100 border-pink-500 text-gray-800'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className='mb-8'>
        <label className='flex items-center gap-2 cursor-pointer select-none'>
          <input
            type="checkbox"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleInputChange}
            className='w-4 h-4 accent-gray-800'
          />
          <span className='text-gray-700'>Add to bestseller</span>
        </label>
      </div>

      {/* ADD Button */}
      <button
        type="submit"
        disabled={loading}
        className='bg-black text-white px-10 py-2.5 rounded-sm hover:bg-gray-800 transition font-medium disabled:opacity-50'
      >
        {loading ? 'Adding...' : 'ADD'}
      </button>
    </form>
  );
};

// ==================== LIST PRODUCTS TAB ====================
const ListProductsTab = ({ loading, setLoading }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await adminAPI.getAll();
      setProducts(result.products || []);
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-8 rounded-lg'>
      <p className='mb-2 text-gray-700 text-lg'>All Products List</p>
      
      {loading ? (
        <div className='text-center py-10'>Loading products...</div>
      ) : products.length === 0 ? (
        <div className='text-center py-10 text-gray-600 border bg-gray-50'>No products found</div>
      ) : (
        <div className='flex flex-col'>
          {/* Table Header */}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-2 border-b text-sm font-bold text-gray-700'>
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b className='text-center'>Action</b>
          </div>

          {/* Product Rows */}
          {products.map((item, index) => {
            // Find first valid image to show
            const displayImage = item.image.find(img => img && img.trim() !== '') || assets.placeholder;
            
            return (
              <div key={item._id || index} className='grid grid-cols-[0.8fr_2.5fr_1fr_0.8fr_0.5fr] items-center py-3 px-2 border-b border-gray-200 text-sm'>
                <img className='w-14 h-14 object-cover border border-gray-200 bg-gray-50' src={displayImage} alt={item.name} />
                <p className='text-gray-700 font-medium truncate pr-2'>{item.name}</p>
                <p className='text-gray-500'>{item.category}</p>
                <p className='text-gray-700 font-semibold'>₹{item.price}</p>
                <div className='flex justify-center'>
                  <button 
                    onClick={() => handleDelete(item._id)} 
                    className='text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors'
                    title="Delete Product"
                  >
                    <span className='text-lg'>✕</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==================== ORDERS TAB ====================
const OrdersTab = ({ loading, setLoading }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      // Fetch all orders from backend
      const response = await fetch('https://shopeaseecomercewebiste-1.onrender.com/api/orders/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const result = await response.json();
      setOrders(result.orders || []);
    } catch (error) {
      // If endpoint doesn't exist, show empty state
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated!');
      fetchAllOrders();
    } catch (error) {
      ErrorHandler.handle(error);
    }
  };

  return (
    <div className='bg-white p-8 rounded-lg'>
      <p className='mb-4 text-gray-700 text-lg'>Order Page</p>

      {loading ? (
        <div className='text-center py-10'>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className='text-center py-10 text-gray-600 border bg-gray-50'>No orders found</div>
      ) : (
        <div className='space-y-5'>
          {orders.map(order => (
            <div key={order._id} className='border border-gray-200 p-6 bg-white'>
              <div className='flex items-start gap-5'>
                {/* Package Icon */}
                <div className='shrink-0 pt-1'>
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/%3E%3Cpolyline points='3.27 6.96 12 12.01 20.73 6.96'/%3E%3Cline x1='12' y1='22.08' x2='12' y2='12'/%3E%3C/svg%3E" alt="order" className='w-10 h-10' />
                </div>

                {/* Item + Customer Info */}
                <div className='flex-1 min-w-0'>
                  <p className='text-gray-800 text-sm'>
                    {order.items?.map((item, i) => (
                      <span key={i}>{item.name || 'Item'} x {item.quantity || 1} {item.size || ''}{i < order.items.length - 1 ? ', ' : ''}</span>
                    ))}
                  </p>
                  <p className='text-sm text-gray-800 font-semibold mt-2'>{order.address?.firstName} {order.address?.lastName}</p>
                  <p className='text-sm text-gray-500'>{order.address?.street},</p>
                  <p className='text-sm text-gray-500'>{order.address?.city}, {order.address?.state}, {order.address?.zipcode}</p>
                </div>

                {/* Order Info */}
                <div className='text-sm text-gray-600 min-w-[140px]'>
                  <p>Items : {order.items?.length || 0}</p>
                  <p className='mt-1'>Method : {order.paymentMethod || 'COD'}</p>
                  <p>Payment : {order.paymentStatus || 'Pending'}</p>
                  <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Amount */}
                <div className='min-w-[60px]'>
                  <p className='text-gray-800 font-medium'>₹{order.amount}</p>
                </div>

                {/* Status Dropdown */}
                <div className='min-w-[150px]'>
                  <select
                    value={order.status || 'Order Placed'}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400 bg-white text-sm'
                  >
                    <option>Order Placed</option>
                    <option>Packing</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== ADMIN LOGIN COMPONENT ====================
const AdminLogin = ({ setToken }) => {
  const [currentState, setCurrentState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentState === 'Login') {
        const result = await adminAPI.login({ email, password });
        if (result.success) {
          setToken(result.token);
          toast.success('Admin Login Success');
        }
      } else {
        // Sign Up Logic
        const result = await adminAPI.signup({ name, email, password });
        if (result.success) {
          toast.success('Admin account created successfully! Please login.');
          setCurrentState('Login');
        }
      }
    } catch (error) {
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-gray-100'>
        <div className='inline-flex items-center gap-2 mb-6'>
            <h1 className='text-3xl font-bold text-gray-800 prate-regular'>{currentState}</h1>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        
        <form onSubmit={handleSubmit} className='space-y-4 font-normal'>
          {currentState === 'Login' ? '' : (
            <div className='space-y-2'>
              <label className='block text-xs font-semibold text-gray-600 uppercase tracking-wider'>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
                className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition text-sm'
                required
              />
            </div>
          )}

          <div className='space-y-2'>
            <label className='block text-xs font-semibold text-gray-600 uppercase tracking-wider'>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition text-sm'
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-xs font-semibold text-gray-600 uppercase tracking-wider'>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition text-sm'
              required
            />
          </div>

          <div className='w-full flex justify-between text-sm mt-2'>
            <p className='cursor-pointer text-gray-600 hover:text-black'>Forgot password?</p>
            {currentState === 'Login' 
              ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-gray-600 hover:text-black'>Create Admin Account</p>
              : <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-gray-600 hover:text-black'>Login Here</p>
            }
          </div>

          <button
            type="submit"
            disabled={loading}
            className='w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition mt-6 disabled:opacity-50'
          >
            {loading ? 'Processing...' : (currentState === 'Login' ? 'Login' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin

