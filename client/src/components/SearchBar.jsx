import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { CiSearch } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const visible = location.pathname.includes('collection');

    return showSearch && visible ? (
        <div className='border-t border-b bg-gray-50 text-center'>
            <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input value={search} onChange={(e) => setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm' type="text" placeholder='Search' />
                <CiSearch className='w-4' />
            </div>
            <IoMdClose onClick={() => setShowSearch(false)} className='inline w-3 cursor-pointer' />
        </div>
    ) : null
}

export default SearchBar
