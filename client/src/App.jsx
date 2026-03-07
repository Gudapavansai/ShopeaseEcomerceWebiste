import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";
import TrackOrder from "./Pages/TrackOrder";
import Admin from "./Pages/Admin";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />        
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <SearchBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default App;


