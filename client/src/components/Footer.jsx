
import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        
        {/* Left Section */}
        <div>
            <Link to="/" className="flex items-center gap-0">
                   <img src={assets.logo} className="w-12 sm:w-24 md:w-30" alt="ShopEase" />
                   <p className="prata-regular text-xl sm:text-3xl md:text-5xl text-gray-800">ShopEase</p>
                </Link>
            <p className='w-full md:w-2/3 text-gray-600'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
        </div>

        {/* Center Section */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <Link to='/'><li>Home</li></Link>
                <Link to='/about'><li>About us</li></Link>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        {/* Right Section */}
         <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+919876543210</li>
                <li>contact@shopease.com</li>
            </ul>
        </div>

      </div>

      {/* Copyright Text */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2026@ shopease.com - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
