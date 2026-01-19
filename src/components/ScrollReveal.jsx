import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, className = '', animation = 'zoomInFadeIn' }) => {
    const elementRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect(); // Animate only once
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the item is visible
                rootMargin: '0px 0px -50px 0px' // Slightly offset triggers
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={elementRef}
            className={`${className} ${isVisible ? '' : 'opacity-0'}`}
            style={{
                animation: isVisible ? `${animation} 0.8s ease-out forwards` : 'none'
            }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
