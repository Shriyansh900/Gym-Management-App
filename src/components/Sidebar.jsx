import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
  const { user, isAdmin, isTrainer, isMember } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminNavItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      path: '/members', 
      label: 'Members', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      path: '/trainers', 
      label: 'Trainers', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      path: '/classes', 
      label: 'Classes', 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      path: '/payments', 
      label: 'Payments', 
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    { 
      path: '/leads', 
      label: 'Leads', 
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      gradient: 'from-pink-500 to-pink-600'
    }
  ];

  const trainerNavItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      path: '/my-members', 
      label: 'My Members', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      path: '/classes', 
      label: 'Classes', 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      path: '/attendance', 
      label: 'Attendance', 
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      path: '/progress', 
      label: 'Progress', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  const memberNavItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      path: '/profile', 
      label: 'My Profile', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      path: '/classes', 
      label: 'Book Classes', 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      path: '/my-progress', 
      label: 'My Progress', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      path: '/workouts', 
      label: 'My Workouts', 
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      gradient: 'from-pink-500 to-pink-600'
    },
    { 
      path: '/membership', 
      label: 'Membership', 
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      gradient: 'from-yellow-500 to-yellow-600'
    }
  ];

  const getNavItems = () => {
    if (isAdmin) return adminNavItems;
    if (isTrainer) return trainerNavItems;
    if (isMember) return memberNavItems;
    return [];
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-xl shadow-medium hover:shadow-large transition-all duration-200"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'w-72 lg:w-80'}
        bg-white/90 backdrop-blur-xl shadow-large border-r border-gray-200/50 
        transition-all duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">GymPro</h2>
                  <p className="text-xs text-gray-500 font-medium">Management</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <svg className={`w-5 h-5 transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {getNavItems().map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover-lift ${
                  isActive
                    ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-glow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  {!isCollapsed && (
                    <span className="ml-3 transition-all duration-200">{item.label}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200/50">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Online</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;