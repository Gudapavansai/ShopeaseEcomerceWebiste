import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { orderAPI } from '../services/api';
import Title from '../components/Title';
import { 
    FaBox, 
    FaTruck, 
    FaHome, 
    FaChevronLeft,
    FaShippingFast,
    FaMapMarkerAlt,
    FaPhoneAlt
} from "react-icons/fa";
import { MdOutlineReceiptLong } from "react-icons/md";

const TrackOrder = () => {
    const { orderId } = useParams();
    const { currency } = useContext(ShopContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const result = await orderAPI.getById(orderId);
                if (result.success) {
                    setOrder(result.order);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (loading) return (
        <div className='flex items-center justify-center min-h-[60vh] uppercase'>
            <div className='flex flex-col items-center gap-4'>
                <div className='w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin'></div>
                <p className='text-gray-500 tracking-widest text-xs'>Loading Details...</p>
            </div>
        </div>
    );
    
    if (!order) return (
        <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center uppercase'>
            <h2 className='text-2xl font-medium text-gray-800 mb-3 tracking-widest'>Order Not Found</h2>
            <Link to="/orders" className='bg-black text-white px-8 py-3 text-xs font-medium hover:bg-gray-800 transition-all flex items-center gap-2'>
                <FaChevronLeft size={10} /> Back to My Orders
            </Link>
        </div>
    );

    const statuses = [
        { name: 'Order Placed', icon: <MdOutlineReceiptLong />, color: 'bg-orange-400' },
        { name: 'Packing', icon: <FaBox />, color: 'bg-orange-400' },
        { name: 'Shipped', icon: <FaShippingFast />, color: 'bg-orange-400' },
        { name: 'Out for Delivery', icon: <FaTruck />, color: 'bg-orange-400' },
        { name: 'Delivered', icon: <FaHome />, color: 'bg-green-500' }
    ];

    const currentStatusIndex = statuses.findIndex(s => s.name === (order.status || 'Order Placed'));
    const deliveryDate = order.createdAt ? new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toDateString() : 'TBD';

    return (
        <div className='pt-16 uppercase'>
            <div className='flex items-center justify-between mb-8'>
                <Title title1={'TRACK'} text2={'ORDER'} />
                <Link to="/orders" className='text-xs font-medium text-gray-500 hover:text-black transition-all flex items-center gap-1 border-b border-white hover:border-black'>
                    <FaChevronLeft size={8} /> BACK TO ORDERS
                </Link>
            </div>

            <div className='bg-white p-6 sm:p-10 rounded-sm mb-10'>
                <div className='flex flex-col md:flex-row justify-between gap-8 mb-12 pb-8'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-gray-400 text-[10px] font-bold tracking-widest'>ORDER ID</p>
                        <p className='text-sm font-medium'>#{order._id.toUpperCase()}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-gray-400 text-[10px] font-bold tracking-widest'>STATUS</p>
                        <div className='flex items-center gap-2'>
                            <p className={`w-2 h-2 rounded-full ${order.status === 'Cancelled' ? 'bg-red-500' : order.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-400'}`}></p>
                            <p className='text-sm font-medium'>{order.status}</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-gray-400 text-[10px] font-bold tracking-widest'>ESTIMATED DELIVERY</p>
                        <p className='text-sm font-medium text-green-600'>{deliveryDate.toUpperCase()}</p>
                    </div>
                </div>

                {/* Progress Timeline */}
                <div className='relative mt-12 mb-20 px-4'>
                    <div className='hidden md:block absolute top-[27px] left-10 right-10 h-[1px] bg-gray-200 z-0'></div>
                    <div className='hidden md:block absolute top-[27px] left-10 h-[1px] bg-black z-0 transition-all duration-1000' 
                         style={{ width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100}%` }}></div>
                    
                    <div className='flex flex-col md:flex-row justify-between gap-10 md:gap-4'>
                        {statuses.map((s, index) => (
                            <div key={s.name} className='flex flex-row md:flex-col items-center gap-6 md:gap-4 relative z-10'>
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all duration-500 border ${index <= currentStatusIndex ? 'bg-black text-white border-black shadow-lg shadow-gray-200' : 'bg-white text-gray-200 border-gray-100'}`}>
                                    {s.icon}
                                </div>
                                <div className='flex flex-col md:items-center'>
                                    <p className={`text-[10px] font-bold tracking-widest ${index <= currentStatusIndex ? 'text-black' : 'text-gray-300'}`}>
                                        {s.name}
                                    </p>
                                    <p className='text-[8px] text-gray-400 mt-1'>
                                        {index <= currentStatusIndex ? '✓ SUCCESS' : 'PENDING'}
                                    </p>
                                </div>
                                {index < statuses.length - 1 && (
                                    <div className='md:hidden absolute left-7 top-14 w-[1px] h-10 bg-gray-100'></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 pt-10'>
                    {/* Order Summary */}
                    <div>
                        <h3 className='text-xs font-bold tracking-widest mb-6 flex items-center gap-2'>
                            <span className='w-1 h-3 bg-black'></span>
                            ITEMS SUMMARY
                        </h3>
                        <div className='space-y-6'>
                            {order.items && order.items.map((item, i) => (
                                <div key={i} className='flex gap-4 items-center'>
                                    <img className='w-16 h-16 object-cover' src={Array.isArray(item.image) ? item.image[0] : item.image} alt="" />
                                    <div>
                                        <p className='text-xs font-bold text-gray-800'>{item.name}</p>
                                        <p className='text-[10px] text-gray-500 mt-1'>{currency}{item.price} | QTY: {item.quantity} | SIZE: {item.size}</p>
                                    </div>
                                </div>
                            ))}
                            <div className='pt-4 border-t border-dashed'>
                                <p className='text-xs font-bold flex justify-between tracking-widest'>
                                    <span>TOTAL AMOUNT</span>
                                    <span>{currency}{order.amount}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Shipping */}
                    <div className='bg-gray-50 p-6 rounded-sm'>
                        <h3 className='text-xs font-bold tracking-widest mb-6 flex items-center gap-2'>
                            <span className='w-1 h-3 bg-black'></span>
                            SHIPPING ADDRESS
                        </h3>
                        {order.address && (
                            <div className='space-y-4 text-[11px] text-gray-600 font-medium tracking-wider'>
                                <p className='text-black text-sm font-bold mb-2'>{order.address.firstName} {order.address.lastName}</p>
                                <div className='flex items-start gap-2'>
                                    <FaMapMarkerAlt className='mt-0.5 text-gray-400' />
                                    <p>{order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}, {order.address.country}</p>
                                </div>
                                <div className='flex items-center gap-2 pt-2'>
                                    <FaPhoneAlt className='text-gray-400' />
                                    <p className='text-black'>CONTACT: {order.address.phone}</p>
                                </div>
                                <div className='mt-6 p-3 bg-white rounded-sm'>
                                    <p className='text-[9px] text-gray-400 mb-1'>PAYMENT METHOD</p>
                                    <p className='text-gray-800 font-bold'>{order.paymentMethod.toUpperCase()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
