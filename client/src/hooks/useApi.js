import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for making API calls
 * Handles loading, error, and success states
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Make API call with loading and error handling
   * @param {Function} apiFunction - API function to call
   * @param {boolean} showToast - Whether to show toast notifications
   * @returns {Promise}
   */
  const execute = useCallback(async (apiFunction, showToast = true) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiFunction();
      setData(result);

      if (showToast && result.message) {
        toast.success(result.message);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);

      if (showToast) {
        toast.error(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, execute };
};

export default useApi;
