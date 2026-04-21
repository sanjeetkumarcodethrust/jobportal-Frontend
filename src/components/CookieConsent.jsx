import { useState, useEffect } from 'react';
import { X, Cookie, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show after a brief delay so it doesn't flash on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          id="cookie-consent"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl ring-1 ring-gray-200/60 dark:ring-slate-700/60 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-amber-500" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    We value your privacy
                  </h3>
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept", you consent to our use of cookies.{' '}
                  <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    Learn more
                  </a>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={decline}
                  id="cookie-decline"
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={accept}
                  id="cookie-accept"
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all cursor-pointer"
                >
                  Accept All
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={decline}
                id="cookie-close"
                className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Close cookie banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
