import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity'>
            <div className='bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all scale-100 opacity-100'>
                <div className='p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='bg-red-100 p-2 rounded-full'>
                            <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                            </svg>
                        </div>
                        <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
                    </div>
                    <p className='text-gray-600 mb-8'>
                        {message}
                    </p>
                    <div className='flex justify-end gap-3'>
                        <button
                            onClick={onClose}
                            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors uppercase tracking-wider'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95'
                        >
                            Yes, Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
