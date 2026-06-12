"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";

const PageViewsTracker = () => {
  const location = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Generate a unique session ID if not exists
        let sessionId = sessionStorage.getItem('cybercrux_session_id');
        if (!sessionId) {
          sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          sessionStorage.setItem('cybercrux_session_id', sessionId);
        }

        // Track the page view
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555') + '/api/track-page-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            pageName: location,
            userId: user?.id || null,
            sessionId: sessionId
          })
        });

        // Update session activity
        sessionStorage.setItem('cybercrux_last_activity', Date.now().toString());
      } catch (error) {
        // Silently fail - don't break user experience
        console.debug('Page view tracking failed:', error);
      }
    };

    // Track page view when location changes
    trackPageView();

    // Track session activity
    const updateSessionActivity = () => {
      sessionStorage.setItem('cybercrux_last_activity', Date.now().toString());
    };

    // Update activity on user interaction
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateSessionActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateSessionActivity);
      });
    };
  }, [location, user?.id]);

  // This component doesn't render anything
  return null;
};

export default PageViewsTracker;
