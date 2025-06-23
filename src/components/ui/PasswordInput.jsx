import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const PasswordInput = ({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder = "Enter your password",
  required = false,
  className = "",
  label = "Password"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const eyeRef = useRef(null);

  useEffect(() => {
    if (eyeRef.current) {
      gsap.to(eyeRef.current, {
        scale: showPassword ? 1.1 : 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  }, [showPassword]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    
    // Add a subtle animation to the eye icon
    if (eyeRef.current) {
      gsap.fromTo(eyeRef.current, 
        { rotation: 0 },
        { rotation: 360, duration: 0.3, ease: "power2.out" }
      );
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          required={required}
          value={value}
          onChange={onChange}
          className={`appearance-none block w-full px-4 py-3 pr-12 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/20 dark:border-gray-600/30 rounded-xl placeholder-gray-500/60 dark:placeholder-gray-400/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50 focus:border-transparent transition-all duration-200 text-sm ${className}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <div ref={eyeRef} className="w-5 h-5">
            {showPassword ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;