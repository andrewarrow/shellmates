import { useState, useRef } from 'react';

/**
 * Modal component for displaying and copying contact information
 */
function ContactModal({ isOpen, onClose, email }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const emailRef = useRef(null);
  const defaultEmail = 'andrew@example.com';
  
  // Use a safe email value that is guaranteed to not be undefined
  const safeEmail = email || defaultEmail;
  
  const handleCopyEmail = (e) => {
    // Prevent any default behavior
    e?.preventDefault();
    
    if (emailRef.current) {
      // Use the safeEmail directly instead of getting from input value
      const emailToCopy = safeEmail;
      
      navigator.clipboard.writeText(emailToCopy)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy email:', err);
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Contact Information
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Owner's Email Address
            </label>
            <div className="flex">
              <input
                ref={emailRef}
                type="email"
                value={safeEmail}
                readOnly
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={(e) => handleCopyEmail(e)}
                className={`px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white ${
                  copySuccess ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Use this email to get in touch with the owner about this spot.
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
