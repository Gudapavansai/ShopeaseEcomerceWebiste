import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ConfirmationModal from '../components/ConfirmationModal'
import Title from '../components/Title'
import { FaChevronRight, FaRegClock, FaReceipt } from 'react-icons/fa'

const Orders = () => {

    const { currency, orders, cancelOrder, token, navigate, clearOrders } = useContext(ShopContext);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <div className='pt-16 uppercase'>
            
            <div className='flex items-center justify-between mb-10'>
                <Title title1={'MY'} text2={'ORDERS'} />
                {orders && orders.length > 0 && (
                    <button 
                        onClick={() => setIsClearModalOpen(true)}
                        className='text-[10px] font-bold tracking-widest text-red-500 hover:text-red-700 transition-all border-b border-transparent hover:border-red-700'
                    >
                        CLEAR ALL HISTORY
                    </button>
                )}
            </div>

            {/* Modals */}
            <ConfirmationModal 
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={clearOrders}
                title="Clear History"
                message="Are you sure you want to clear your entire order history? This action is permanent and cannot be reversed."
            />

            <ConfirmationModal 
                isOpen={!!orderToCancel}
                onClose={() => setOrderToCancel(null)}
                onConfirm={() => cancelOrder(orderToCancel)}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action will halt your delivery process."
            />

            <div className='flex flex-col gap-16'>
                {
                    orders && orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id} className='animate-fadeIn'>
                                {/* Order Header Details */}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-4 py-3 bg-gray-50 rounded-sm gap-4'>
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-gray-400 text-[9px] font-bold tracking-widest'>ORDER IDENTIFICATION</p>
                                        <p className='text-xs font-bold'>#{order._id.toUpperCase()}</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-gray-400 text-[9px] font-bold tracking-widest'>PLACED ON</p>
                                        <p className='text-xs font-bold'>{new Date(order.createdAt).toDateString().toUpperCase()}</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-gray-400 text-[9px] font-bold tracking-widest'>TOTAL AMOUNT</p>
                                        <p className='text-xs font-bold text-black'>{currency}{order.amount}</p>
                                    </div>
                                    <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100'>
                                        <p className={`w-2 h-2 rounded-full ${order.status === 'Cancelled' ? 'bg-red-500' : order.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-400'}`}></p>
                                        <p className='text-[10px] font-bold tracking-widest text-gray-700'>{order.status}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className='space-y-6 px-2'>
                                    {order.items.map((item, itemIndex) => (
                                        <div key={`${order._id}-${itemIndex}`} className='flex flex-row items-center justify-between gap-4'>
                                            <div className='flex items-center gap-6'>
                                                <img className='w-16 h-20 object-cover rounded-sm' src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.name} />
                                                <div className='flex flex-col gap-1'>
                                                    <p className='text-xs sm:text-sm font-bold text-gray-900 tracking-tight'>{item.name}</p>
                                                    <div className='flex items-center gap-4 text-[10px] font-bold text-gray-500'>
                                                        <p>{currency}{item.price}</p>
                                                        <p>QTY: {item.quantity}</p>
                                                        <p>SIZE: {item.size}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Action for the last item in a row or grouped? Let's keep it global per order */}
                                            {itemIndex === order.items.length - 1 && (
                                                <div className='flex flex-col sm:flex-row gap-3 ml-auto'>
                                                    <button 
                                                        onClick={() => navigate(`/track-order/${order._id}`)}
                                                        className='text-[10px] font-bold tracking-widest bg-black text-white px-6 py-2.5 hover:bg-gray-800 transition-all flex items-center gap-2'
                                                    >
                                                        TRACK ORDER <FaChevronRight size={8} />
                                                    </button>
                                                    {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                                        <button 
                                                            onClick={() => setOrderToCancel(order._id)}
                                                            className='text-[10px] font-bold tracking-widest text-gray-400 hover:text-red-500 transition-all uppercase px-4'
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='flex flex-col items-center justify-center py-20 text-center'>
                            <FaReceipt className='text-5xl text-gray-100 mb-4' />
                            <p className='text-gray-400 tracking-widest font-medium'>You haven't placed any orders yet.</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Orders
