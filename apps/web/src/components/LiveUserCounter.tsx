'use client';

import React, { useEffect, useState } from 'react';
import Ably from 'ably';

export const LiveUserCounter = () => {
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        const ably = new Ably.Realtime({ authUrl: '/api/realtime/auth' });
        const channel = ably.channels.get('live-user-count');

        // This function will be called whenever someone enters or leaves
        const updateCount = () => {
            channel.presence.get((err, members) => {
                if (!err && members) {
                    setUserCount(members.length);
                }
            });
        };

        // Subscribe to presence events and call our update function
        channel.presence.subscribe(['enter', 'leave', 'present'], updateCount);

        // Announce this user's presence on the channel
        channel.presence.enter();

        // Clean up when the component unmounts
        return () => {
            channel.presence.leave();
            ably.close();
        };
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="live-counter-container">
            <span className="live-indicator"></span>
            <p>
                <strong>{userCount}</strong> {userCount === 1 ? 'user is' : 'users are'} currently finding their lookalike!
            </p>
        </div>
    );
};
