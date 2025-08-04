'use client';

import React, { useEffect, useState } from 'react';

export const TotalUserCounter = () => {
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        // Fetch the count from our new API endpoint when the component loads
        fetch('/api/users/count')
            .then(res => res.json())
            .then(data => {
                if (data.count) {
                    setUserCount(data.count);
                }
            })
            .catch(console.error);
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="total-counter-container">
            <p>
                Total <strong>{userCount}</strong>+ users have already found their lookalike! Join Now :)
            </p>
        </div>
    );
};
