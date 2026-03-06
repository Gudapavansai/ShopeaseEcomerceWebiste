import { createContext, useEffect, useState } from "react";
import { products as staticProducts } from "../assets.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { productAPI, orderAPI, authAPI } from "../services/api";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [products, setProducts] = useState(staticProducts); // Start with static, sync with API
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cartItems');
            return storedCart ? JSON.parse(storedCart) : {};
        } catch (error) {
            console.error("Failed to load cart from local storage", error);
            return {};
        }
    });

    const [orders, setOrders] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('authToken') || '');
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const navigate = useNavigate();

    // Fetch products from backend
    const getProductsData = async () => {
        try {
            const result = await productAPI.getAll();
            if (result.success) {
                setProducts(result.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            // Fallback to static products already set in state
        }
    }

    // Initialize data
    useEffect(() => {
        getProductsData();
        
        // Clean up invalid sessions
        if (localStorage.getItem('userId') === 'undefined') {
            localStorage.removeItem('userId');
            localStorage.removeItem('authToken');
            setToken('');
        }

        // Also fetch user orders if logged in
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUserOrders(userId);
        }
    }, [token]);

    const getUserOrders = async (userId) => {
        try {
            const result = await orderAPI.getUserOrders(userId);
            if (result.success) {
                setOrders(result.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to cart");
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo) {
                for (const item in cartItems[items]) {
                    try {
                        if (cartItems[items][item] > 0) {
                            totalAmount += itemInfo.price * cartItems[items][item];
                        }
                    } catch (error) {

                    }
                }
            }
        }
        return totalAmount;
    }

    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem('cartItems');
    }

    const placeOrder = async (address, paymentMethod, shouldSave = true, upiId = '') => {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            toast.error("Please login to place an order");
            navigate('/login');
            return;
        }

        const items = [];
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    const productInfo = products.find(product => product._id === itemId);
                    if (productInfo) {
                        items.push({
                            ...productInfo,
                            size,
                            quantity: cartItems[itemId][size]
                        });
                    }
                }
            }
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // --- Simulated Online Payment Flow ---
        if (paymentMethod !== 'cod') {
            const loadingToast = toast.loading(`Connecting to ${paymentMethod.toUpperCase()}...`);
            
            // Simulate payment processing time
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast.update(loadingToast, { 
                render: `Authorizing UPI: ${upiId}...`, 
                type: "info", 
                isLoading: true 
            });

            await new Promise(resolve => setTimeout(resolve, 2000));

            // AUTHORIZED UPI Pattern (Supports all Indian banks)
            // Format: username@bankcode (e.g., name@axis, name@oksbi, name@apl, etc.)
            const upiRegex = /^[a-zA-Z0-9.\-_]{3,}@[a-zA-Z]{2,64}$/;
            const upiLower = upiId.toLowerCase();
            const specificTestIds = ['test@upi', 'success@okaxis', 'shop@upi'];
            
            const isValidFormat = upiRegex.test(upiLower);
            const isTestId = specificTestIds.includes(upiLower);

            if (!isValidFormat && !isTestId) {
                toast.update(loadingToast, { 
                    render: "Invalid UPI ID format. Please enter a valid ID (e.g., username@bank).", 
                    type: "error", 
                    isLoading: false, 
                    autoClose: 4000 
                });
                return;
            }

            // Simulate additional authorization processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.update(loadingToast, { 
                render: "Payment Authorized! Redirecting to app...", 
                type: "success", 
                isLoading: false, 
                autoClose: 2000 
            });

            // --- DEEP LINK REDIRECT ---
            // Constructing a standard UPI URI
            // pa: Payment Address (Merchant VPA), pn: Payee Name, am: Amount, cu: Currency
            const merchantVpa = "shop@oksbi"; // Your merchant VPA
            const merchantName = "Shopease Ecommerce";
            const orderAmount = getCartAmount() + delivery_fee;
            
            const upiUrl = `upi://pay?pa=${merchantVpa}&pn=${encodeURIComponent(merchantName)}&am=${orderAmount}&cu=INR&tn=Order_Payment`;

            // Attempt to open the UPI app
            // Note: This usually works best on mobile devices with UPI apps installed
            setTimeout(() => {
                window.location.href = upiUrl;
                
                // Fallback for desktop/simulated environments
                if (paymentMethod === 'phonepe') {
                    // Simulated external PhonePe redirect for desktop testing
                    console.log("Redirecting to PhonePe interface...");
                    // In a real integration, this would be the PhonePe gateway URL
                }
            }, 1500);
            
            // Wait for the redirect/app return simulation
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        // -------------------------------------

        const orderData = {
            userId,
            items,
            amount: getCartAmount() + delivery_fee,
            address,
            paymentMethod,
            upiId: upiId || undefined
        };

        try {
            const result = await orderAPI.create(orderData);
            if (result.success) {
                toast.success("Order placed successfully!");
                // Save address for next time if requested
                if (shouldSave) {
                    saveDeliveryAddress(address);
                }
                clearCart();
                setOrders(prev => [result.order, ...prev]);
                navigate('/orders');
            }
        } catch (error) {
            console.error("Order placement failed:", error);
            toast.error(error.message || "Failed to place order");
        }
    }

    const cancelOrder = async (orderId) => {
        try {
            const result = await orderAPI.cancel(orderId);
            if (result.success) {
                toast.success("Order cancelled");
                setOrders(prev => prev.map(order => 
                    order._id === orderId ? { ...order, status: 'Cancelled' } : order
                ));
            }
        } catch (error) {
            console.error("Order cancellation failed:", error);
            toast.error("Failed to cancel order");
        }
    }

    const getDeliveryAddress = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId || userId === 'undefined') return null;
        try {
            const result = await authAPI.getDeliveryAddress(userId);
            if (result.success) {
                setDeliveryAddress(result.deliveryAddress);
                return result.deliveryAddress;
            }
        } catch (error) {
            console.error("Error fetching delivery address:", error);
        }
        return null;
    }

    const saveDeliveryAddress = async (addressData) => {
        const userId = localStorage.getItem('userId');
        if (!userId || userId === 'undefined') {
            throw new Error("User session invalid. Please log in again.");
        }
        try {
            const result = await authAPI.saveDeliveryAddress(userId, addressData);
            if (result.success) {
                setDeliveryAddress(addressData); // Immediate update in local state
                return result;
            }
        } catch (error) {
            console.error("Error saving delivery address:", error);
            throw error;
        }
    }

    const clearOrders = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        try {
            const result = await orderAPI.clear(userId);
            if (result.success) {
                setOrders([]);
                toast.success("Order history cleared");
            }
        } catch (error) {
            console.error("Failed to clear orders:", error);
            toast.error("Failed to clear order history");
        }
    }

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount, navigate, placeOrder, orders, cancelOrder,
        getUserOrders, clearCart, getDeliveryAddress, saveDeliveryAddress,
        deliveryAddress, setDeliveryAddress,
        token, setToken, clearOrders, getProductsData
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
