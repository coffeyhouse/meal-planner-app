// src/components/common/ErrorMessage.jsx

import React from 'react';

function ErrorMessage({ message }) {
    return (
        <div className="text-red-600 text-center">
            <p>Error: {message}</p>
        </div>
    );
}

export default ErrorMessage;
