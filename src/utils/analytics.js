
import mixpanel from 'mixpanel-browser';

// --- CONFIGURATION ---
// TODO: Enter your Tracking IDs here

const MIXPANEL_TOKEN = 'a6a0ce10c7ec2b13c2dd02c767d0e9d4'; // e.g. 1234567890abcdef1234567890abcdef

const isProduction = import.meta.env.PROD;

export const initAnalytics = () => {


    // Initialize Mixpanel
    if (MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'YOUR_MIXPANEL_TOKEN') {
        mixpanel.init(MIXPANEL_TOKEN, {
            debug: !isProduction,
            track_pageview: true,
            persistence: 'localStorage',
        });
        if (!isProduction) console.log('Mixpanel Initialized');
    } else {
        if (!isProduction) console.warn('Mixpanel Token missing');
    }
};

export const trackEvent = (eventName, properties = {}) => {
    if (!isProduction) {
        console.log(`[Analytics] Event: ${eventName}`, properties);
    }



    // Mixpanel Event
    if (MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'YOUR_MIXPANEL_TOKEN') {
        mixpanel.track(eventName, properties);
    }
};

export const trackPageView = (pageName) => {
    if (!isProduction) {
        console.log(`[Analytics] Page View: ${pageName}`);
    }



    // Mixpanel handles this via track_pageview: true on init, but we can force it or let it be.
    // We'll rely on the event tracking for specific "screen" changes in this app since it's a scroll/slide app.
};
