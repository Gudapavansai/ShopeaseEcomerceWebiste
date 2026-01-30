import React, { useState, useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CiSearch } from "react-icons/ci"
import { CgProfile } from "react-icons/cg"
import { HiOutlineShoppingBag } from "react-icons/hi2"
import { HiOutlineMenuAlt3 } from "react-icons/hi"
import { IoIosArrowBack } from "react-icons/io"
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets'
const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const { setShowSearch, getCartCount } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">

      {/* Logo */}
     <Link to="/" className="flex items-center">
        <img src={assets.logo} className="w-12 sm:w-20" alt="ShopEase" />
        <p className="prata-regular text-xl sm:text-3xl text-gray-800">ShopEase</p>
     </Link>


      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-5 text-m text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      {/* Right Icons */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <CiSearch onClick={()=>{setShowSearch(true); navigate('/collection')}} className="cursor-pointer text-[30px] sm:text-[30px]" />

        {/* Profile */}
        <div className="group relative">
          <Link to="/login"><CgProfile className="cursor-pointer text-[30px] sm:text-[30px]" /></Link>
          <div className="group-hover:block hidden absolute right-0 pt-4">
            <div className="flex flex-col gap-3 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <Link to="/orders" className="cursor-pointer hover:text-black">Orders</Link>
              <Link to="/login" className="cursor-pointer hover:text-black">Login</Link>
            </div>
          </div>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <HiOutlineShoppingBag className="cursor-pointer text-[30px] sm:text-[30px]" />
          <p className="absolute -right-2 -bottom-2 w-5 h-5 flex items-center justify-center bg-black text-white rounded-full text-[10px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu */}
        <HiOutlineMenuAlt3
          onClick={() => setVisible(true)}
          className="cursor-pointer text-[28px] sm:hidden"
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white z-50 overflow-hidden transition-all duration-300 ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-gray-700">

          {/* Back */}
          <div
            className="flex items-center gap-3 p-5 cursor-pointer border-b"
            onClick={() => setVisible(false)}
          >
            <IoIosArrowBack className="text-[22px]" />
            <p>Back</p>
          </div>

          <NavLink to="/" className="p-5 border-b" onClick={() => setVisible(false)}>HOME</NavLink>
          <NavLink to="/collection" className="p-5 border-b" onClick={() => setVisible(false)}>COLLECTION</NavLink>
          <NavLink to="/about" className="p-5 border-b" onClick={() => setVisible(false)}>ABOUT</NavLink>
          <NavLink to="/contact" className="p-5 border-b" onClick={() => setVisible(false)}>CONTACT</NavLink>

        </div>
      </div>

    </div>
  )
}

export default Navbar

