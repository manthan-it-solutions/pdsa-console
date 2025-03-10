import React, { useEffect, useRef } from 'react';

const GoogleTranslateWidget = () => {
  const scriptLoaded = useRef(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame { 
        display: none !important;
      }
      .goog-te-menu-value:hover {
        text-decoration: none !important;
      }
      .goog-te-gadget {
        color: transparent !important;
      }
      .goog-te-gadget .goog-te-combo {
        color: #666 !important;
        padding: 6px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
      }
      .VIpgJd-ZVi9od-l4eHX-hSRGPd,
      .skiptranslate iframe,
      .goog-logo-link {
        display: none !important;
      }
      .VIpgJd-ZVi9od-l4eHX-hSRGPd {
        height: 0 !important;
      }
      body {
        top: 0 !important;
      }.goog-te-gadget-simple{
      padding: 8px !important;
      border: 1px solid #b7b7b7 !important;
      border-radius: 5px !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove old instances
    const cleanup = () => {
      const frames = document.querySelectorAll('.goog-te-menu-frame');
      frames.forEach(frame => frame.remove());

      const elements = document.querySelectorAll('.skiptranslate');
      elements.forEach(element => element.remove());

      const banners = document.querySelectorAll('iframe[name=c]');
      banners.forEach(banner => banner.remove());
    };

    cleanupRef.current = cleanup;

    const initializeTranslate = () => {
      cleanup();

      if (!scriptLoaded.current) {
        window.googleTranslateElementInit = () => {
          try {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,hi,bn,gu,kn,ml,mr,or,pa,ta,te,ur',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );

            // Additional cleanup after initialization
            const removeTopStyle = setInterval(() => {
              const body = document.body;
              if (body.style.top) {
                body.style.top = '';
                clearInterval(removeTopStyle);
              }
            }, 100);

            // Clear interval after 5 seconds if it hasn't succeeded
            setTimeout(() => clearInterval(removeTopStyle), 5000);
          } catch (error) {
            console.error('Google Translate initialization error:', error);
          }
        };

        const existingScript = document.querySelector('script[src*="translate_a/element.js"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          document.body.appendChild(script);
          scriptLoaded.current = true;
        }
      } else {
        window.googleTranslateElementInit();
      }
    };

    const timeoutId = setTimeout(initializeTranslate, 100);

    return () => {
      clearTimeout(timeoutId);
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="google-translate-container"
      style={{
        display: 'inline-block',
        marginLeft: '10px'
      }}
    />
  );
};

export default GoogleTranslateWidget;