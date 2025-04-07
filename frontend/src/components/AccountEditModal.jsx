import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Modal component for editing user account information
 */
function AccountEditModal({ isOpen, onClose }) {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    ssh_key: '',
    github_url: '',
    linkedin_url: '',
    bio: ''
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bioLength, setBioLength] = useState(0);
  const maxBioLength = 1250; // approximately 250 words
  const totalSteps = 4;

  useEffect(() => {
    if (currentUser) {
      setFormData({
        email: currentUser.email || '',
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        ssh_key: currentUser.ssh_key || '',
        github_url: currentUser.github_url || '',
        linkedin_url: currentUser.linkedin_url || '',
        bio: currentUser.bio || ''
      });
      setBioLength(currentUser.bio?.length || 0);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bio') {
      setBioLength(value.length);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      await updateUser(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update account information');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const calculateProfileCompleteness = () => {
    const fields = [
      formData.email,
      formData.first_name,
      formData.last_name,
      formData.ssh_key,
      formData.github_url,
      formData.linkedin_url,
      formData.bio
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Basic Information</h4>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="first_name">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your first name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="last_name">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your last name"
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Social Profiles</h4>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="github_url">
                GitHub URL
              </label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://github.com/your-username"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Add your GitHub profile to showcase your projects and contributions
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="linkedin_url">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://linkedin.com/in/your-profile"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Connect your LinkedIn profile to share your professional background
              </p>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">About You</h4>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="bio">
                Bio <span className="font-normal">({bioLength}/{maxBioLength})</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                maxLength={maxBioLength}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Tell others about yourself, your skills, interests, and what you're looking for (max 250 words)"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Let potential partners know about your technical skills, interests, and what kind of collaborations you're looking for
              </p>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Technical Setup</h4>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="ssh_key">
                SSH Public Key
              </label>
              <textarea
                id="ssh_key"
                name="ssh_key"
                value={formData.ssh_key}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your SSH public key"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This allows secure access to any servers you connect with
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const completenessPercentage = calculateProfileCompleteness();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Complete Your Profile
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

          {/* Step progress indicators */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Completeness: {completenessPercentage}%
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {step} of {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${completenessPercentage}%` }}
              ></div>
            </div>
            {/* Step indicators */}
            <div className="flex justify-between mt-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step > index + 1 
                      ? 'bg-blue-600 text-white' 
                      : step === index + 1 
                        ? 'border-2 border-blue-600 text-blue-600' 
                        : 'border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            <div className="flex justify-between mt-6">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save All'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountEditModal;