import ReactGA from 'react-ga4';
import mixpanel from 'mixpanel-browser';

// --- CONFIGURATION ---
// TODO: Enter your Tracking IDs here
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // e.g. G-1234567890
const MIXPANEL_TOKEN = 'a6a0ce10c7ec2b13c2dd02c767d0e9d4'; // e.g. 1234567890abcdef1234567890abcdef

const isProduction = import.meta.env.PROD;

export const initAnalytics = () => {
    // Initialize Google Analytics 4
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        if (!isProduction) console.log('GA4 Initialized');
    } else {
        if (!isProduction) console.warn('GA4 Measurement ID missing');
    }

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

    // Google Analytics Event
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.event({
            category: 'User Interaction',
            action: eventName,
            label: properties.label || undefined, // fast mapping
            ...properties
        });
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

    // GA4 handles page views automatically with SPAs usually if configured, 
    // but manual tracking ensures we capture virtual page views correctly.
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.send({ hitType: "pageview", page: pageName, title: pageName });
    }

    // Mixpanel handles this via track_pageview: true on init, but we can force it or let it be.
    // We'll rely on the event tracking for specific "screen" changes in this app since it's a scroll/slide app.
};
