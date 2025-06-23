import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import PasswordInput from '../components/ui/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    // Animate page elements on mount
    const tl = gsap.timeline();
    
    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
    .fromTo(logoRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" },
      "-=0.3"
    )
    .fromTo(formRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );

    // Animate demo cards
    gsap.utils.toArray('.demo-card').forEach((card, index) => {
      gsap.fromTo(card,
        { x: -50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.5, 
          delay: 0.8 + (index * 0.1),
          ease: "power2.out"
        }
      );
    });
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Animate form submission
    gsap.to(formRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Simulate API call delay
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        toast.success(`Welcome back, ${foundUser.name}!`, {
          position: "top-center",
          autoClose: 3000,
        });
        login(foundUser);
      } else {
        setError('Invalid email or password');
        toast.error('Invalid credentials. Please try again.', {
          position: "top-center",
          autoClose: 4000,
        });
        
        // Shake animation for error
        gsap.to(formRef.current, {
          x: [-10, 10, -10, 10, 0],
          duration: 0.5,
          ease: "power2.out"
        });
      }
      setLoading(false);
    }, 1000);
  };

  const demoAccounts = [
    { email: 'admin@gym.com', password: 'admin123', role: 'Admin', color: 'from-purple-500 to-pink-500', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { email: 'trainer@gym.com', password: 'trainer123', role: 'Trainer', color: 'from-blue-500 to-cyan-500', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { email: 'member@gym.com', password: 'member123', role: 'Member', color: 'from-green-500 to-emerald-500', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  const fillDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    
    toast.info(`Demo account filled: ${account.role}`, {
      position: "bottom-center",
      autoClose: 2000,
    });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-animated flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div 
            ref={logoRef}
            className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-large hover:scale-110 transition-all duration-300 group cursor-pointer animate-glow"
          >
            <span className="text-white font-bold text-3xl group-hover:scale-110 transition-transform duration-300">G</span>
          </div>
        </div>
        <h2 className="text-center text-4xl font-bold text-white mb-2">
          Welcome to GymPro
        </h2>
        <p className="text-center text-xl text-white/80 font-medium">
          Your fitness journey starts here
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div 
          ref={formRef}
          className="glass rounded-3xl py-10 px-8 shadow-large backdrop-blur-xl border border-white/20"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <PasswordInput
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              label="Password"
              className="bg-white/10 backdrop-blur-sm border-white/20 placeholder-white/60 text-white focus:ring-white/50"
            />

            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-xl text-sm animate-slide-down">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-medium text-sm font-semibold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in to GymPro'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/80 font-medium">Try Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoAccount(account)}
                  className="w-full group demo-card"
                >
                  <div className="flex items-center p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${account.color} shadow-medium group-hover:shadow-large transition-all duration-200`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={account.icon} />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1 text-left">
                      <div className="font-semibold text-white">{account.role} Account</div>
                      <div className="text-sm text-white/70">{account.email}</div>
                    </div>
                    <div className="text-white/60 group-hover:text-white transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="text-center">
              <Link
                to="/register"
                className="font-semibold text-white hover:text-white/80 transition-colors duration-200"
              >
                Don't have an account? <span className="underline">Sign up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;