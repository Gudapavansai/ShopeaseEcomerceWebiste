import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { FaGooglePay } from "react-icons/fa";
import { SiPhonepe, SiPaytm } from "react-icons/si";
import { toast } from 'react-toastify';

const PlaceOrder = () => {

    const [showForm, setShowForm] = useState(true);
    const [saveAddress] = useState(true);
    const { placeOrder, getDeliveryAddress, saveDeliveryAddress, deliveryAddress, token, navigate } = useContext(ShopContext);

    React.useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            getDeliveryAddress();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    // Auto-fill form and toggle view when deliveryAddress changes
    React.useEffect(() => {
        if (deliveryAddress && Object.keys(deliveryAddress).length > 0) {
            setFormData(prev => ({
                ...prev,
                ...deliveryAddress
            }));
            setShowForm(false);
        } else {
            setShowForm(true);
        }
    }, [deliveryAddress]);

    const [method, setMethod] = useState('cod');
    const [upiId, setUpiId] = useState('');

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (method !== 'cod' && !upiId.includes('@')) {
            toast.error("Please enter a valid UPI ID (e.g., name@okaxis)");
            setLoading(false);
            return;
        }

        try {
            await placeOrder(formData, method, saveAddress, upiId);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddNew = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
            phone: ''
        });
        setShowForm(true);
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* Left Side */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3 flex items-center gap-2'>
                    <h2 className='text-gray-600 uppercase tracking-widest'>DELIVERY</h2>
                    <h2 className='text-gray-800 font-medium uppercase tracking-widest'>INFORMATION</h2>
                    <div className='w-12 h-[2px] bg-gray-700 ml-2'></div>
                </div>

                {!showForm && deliveryAddress ? (
                    <div className='border p-5 rounded-lg bg-gray-50 flex flex-col gap-2 relative group transition-all hover:shadow-md'>
                        <div className='flex justify-between items-start'>
                            <p className='font-bold text-gray-800'>{deliveryAddress.firstName} {deliveryAddress.lastName}</p>
                            <div className='flex gap-4'>
                                <button 
                                    type='button'
                                    onClick={() => setShowForm(true)}
                                    className='text-blue-600 text-xs font-semibold hover:underline'
                                >
                                    Edit
                                </button>
                                <button 
                                    type='button'
                                    onClick={handleAddNew}
                                    className='text-green-600 text-xs font-semibold hover:underline'
                                >
                                    Add New
                                </button>
                            </div>
                        </div>
                        <p className='text-sm text-gray-600'>{deliveryAddress.email}</p>
                        <p className='text-sm text-gray-600'>{deliveryAddress.street}, {deliveryAddress.city}</p>
                        <p className='text-sm text-gray-600'>{deliveryAddress.state}, {deliveryAddress.zipcode}</p>
                        <p className='text-sm text-gray-600'>{deliveryAddress.country}</p>
                        <p className='text-sm text-gray-600'>Phone: {deliveryAddress.phone}</p>
                        
                        <div className='mt-4 pt-4 border-t border-gray-200'>
                            <button 
                                type='button' 
                                onClick={handleAddNew}
                                className='flex items-center gap-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors uppercase tracking-wider'
                            >
                                <span className='text-lg'>+</span> Add Another Address
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='flex gap-3'>
                            <input required name='firstName' onChange={onChangeHandler} value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                            <input required name='lastName' onChange={onChangeHandler} value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                        </div>
                        <input required name='email' onChange={onChangeHandler} value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                        <input required name='street' onChange={onChangeHandler} value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                        <div className='flex gap-3'>
                            <input required name='city' onChange={onChangeHandler} value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                            <input required name='state' onChange={onChangeHandler} value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                        </div>
                        <div className='flex gap-3'>
                            <input required name='zipcode' onChange={onChangeHandler} value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Pincode' />
                            <input required name='country' onChange={onChangeHandler} value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                        </div>
                        <input required name='phone' onChange={onChangeHandler} value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
                        
                        <div className='flex gap-2 mt-4'>
                            <button 
                                type='button' 
                                onClick={async () => {
                                    if (!formData.firstName || !formData.lastName || !formData.street || !formData.city || !formData.phone) {
                                        return toast.error("Please fill the required fields");
                                    }
                                    try {
                                        await saveDeliveryAddress(formData);
                                        toast.success("Address saved successfully");
                                        setShowForm(false);
                                    } catch (err) {
                                        toast.error(err.message || "Failed to save address");
                                    }
                                }}
                                className='text-[10px] sm:text-xs font-bold bg-black text-white px-6 py-2.5 hover:bg-gray-800 transition-all rounded-sm uppercase tracking-widest'
                            >
                                Save Address
                            </button>
                            {deliveryAddress && (
                                <button 
                                    type='button'
                                    onClick={() => setShowForm(false)}
                                    className='text-[10px] sm:text-xs font-bold border border-gray-300 px-6 py-2.5 hover:bg-gray-100 transition-all rounded-sm uppercase tracking-widest'
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>


            {/* Right Side */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title title1={'PAYMENT'} text2={'METHOD'} />
                    {/* Payment Method Selection */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('googlepay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'googlepay' ? 'bg-green-400' : ''}`}></p>
                            <FaGooglePay className='text-3xl text-gray-700' />
                        </div>
                        <div onClick={() => setMethod('phonepe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'phonepe' ? 'bg-green-400' : ''}`}></p>
                            <SiPhonepe className='text-3xl text-purple-600' />
                        </div>
                        <div onClick={() => setMethod('paytm')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paytm' ? 'bg-green-400' : ''}`}></p>
                            <SiPaytm className='text-3xl text-blue-500' />
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    {method !== 'cod' && (
                        <div className='mt-6 transition-all duration-300 ease-in-out'>
                            <p className='text-sm text-gray-600 mb-2 font-medium capitalize'>Enter Your {method} UPI ID</p>
                            <input 
                                required 
                                type="text" 
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder='e.g., username@oksbi, username@apl, username@ybl'
                                className='border border-gray-300 rounded py-2.5 px-4 w-full focus:border-black outline-none transition-colors'
                            />
                            <p className='text-[10px] text-gray-400 mt-1 italic'>* Supports all major banks (SBI, Axis, HDFC, ICICI, PNB, etc.) via UPI.</p>
                        </div>
                    )}

                    <div className='w-full text-end mt-8'>
                        <button 
                            type='submit' 
                            disabled={loading}
                            className={`bg-black text-white px-16 py-4 text-sm font-medium hover:bg-gray-800 transition-all shadow-lg active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className='flex items-center gap-2'>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    PROCESSING...
                                </span>
                            ) : 'PLACE ORDER'}
                        </button>
                    </div>
                </div>

            </div>
        </form>
    )
}

export default PlaceOrder

