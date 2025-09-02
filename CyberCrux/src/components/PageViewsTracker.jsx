import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PageViewsTracker = () => {
  const location = useLocation();
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
        await fetch('http://localhost:5000/api/track-page-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            pageName: location.pathname,
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
  }, [location.pathname, user?.id]);

  // This component doesn't render anything
  return null;
};

export default PageViewsTracker;
