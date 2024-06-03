// src/hooks/usePost.js
import { useState } from 'react';

const usePost = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    const postData = async (body, successMessage = 'Operation successful!', errorMessage = 'Operation failed. Please try again later.') => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNotification({ message: successMessage, type: 'success' });
            return data;
        } catch (error) {
            setError(error.message);
            setNotification({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { postData, loading, error, notification, setNotification };
};

export default usePost;
