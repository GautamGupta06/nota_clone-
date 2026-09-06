import React, { useState } from 'react';

export default function OrderModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      
      {/* Overlay Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-lg glass-panel p-8 md:p-10 border border-white/20 bg-zinc-950/95 rounded-3xl shadow-2xl text-center">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 cursor-pointer"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="w-14 h-14 rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center border border-white/20">
              <svg width="28" height="28" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white h-7 w-auto">
                <path d="M27.0312 1.1884C31.7136 -1.90761 38 1.40597 38 6.97004V33.0299C38 38.594 31.7136 41.9076 27.0312 38.8116L17.5942 32.5713C16.9615 33.4443 16.2103 34.2855 15.3465 35.0654C10.678 39.2805 4.50065 40.114 1.54904 36.927C-1.40256 33.74 -0.0107507 27.7393 4.65782 23.5242C5.5628 22.7071 6.52483 22.0177 7.50871 21.4594C6.54119 20.7959 5.60885 20.0135 4.7394 19.1165C-0.396448 13.818 -1.40163 6.53831 2.49429 2.85682C6.39026 -0.824661 13.7122 0.486304 18.8481 5.78487C19.0157 5.9578 19.1787 6.13298 19.3375 6.30992C19.5007 6.17973 19.6697 6.05598 19.8449 5.94015L27.0312 1.1884ZM20.3604 12.7063C16.0229 12.7063 12.5066 16.1781 12.5066 20.4608C12.5066 24.7436 16.0228 28.2156 20.3604 28.2156C24.698 28.2156 28.2145 24.7436 28.2145 20.4608C28.2144 16.1781 24.698 12.7063 20.3604 12.7063Z" fill="white"/>
              </svg>
            </div>

            <h2 className="text-3xl font-light text-white mb-2">Stay ahead</h2>
            <p className="text-sm text-white/60 mb-8 max-w-sm mx-auto">
              Launching soon. Get early priority batch access and insider updates for Nota One.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Enter your e-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-white/50 text-sm transition-colors text-center"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <span>Notify me & Pre-order ($300)</span>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/40">
              <span>✓ Free Global Shipping</span>
              <span>•</span>
              <span>✓ 30-Day Guarantee</span>
            </div>
          </>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-6 text-2xl border border-white/20">
              ✓
            </div>
            <h2 className="text-3xl font-light text-white mb-3">All set.</h2>
            <p className="text-sm text-white/70 mb-8">
              We’ll keep you posted with exclusive early access updates to <span className="font-semibold text-white">{email}</span>.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
