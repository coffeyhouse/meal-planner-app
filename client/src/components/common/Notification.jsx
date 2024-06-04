// src/components/common/Notification.jsx

import React, { useEffect, useState } from 'react';

function Notification({ message, type = 'info', onClose }) {
    const [visible, setVisible] = useState(true);

    const typeStyles = {
        info: 'bg-blue-500 text-white',
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
    };

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 2000);
        const removeNotificationTimer = setTimeout(onClose, 2500); // Slightly longer to ensure fade-out completes

        return () => {
            clearTimeout(timer);
            clearTimeout(removeNotificationTimer);
        };
    }, [onClose]);

    return (
        <div
            className={`max-w-full fixed bottom-0 right-0 transition-opacity duration-500  ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div className={`flex p-4 rounded shadow-lg m-4 ${typeStyles[type]}`}>

                <p>{message}</p>
                <button className="ml-4 font-bold">X</button>
            </div>
        </div>
    );
}

export default Notification;
