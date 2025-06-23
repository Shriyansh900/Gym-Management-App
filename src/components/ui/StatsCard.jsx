const StatsCard = ({ title, value, icon, change, color = 'blue', trend = 'up' }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      icon: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
      text: 'text-green-600',
      border: 'border-green-200'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      icon: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white',
      text: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      icon: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
      text: 'text-red-600',
      border: 'border-red-200'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      icon: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
      text: 'text-purple-600',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      icon: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
      text: 'text-orange-600',
      border: 'border-orange-200'
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className="group bg-white rounded-2xl shadow-soft border border-gray-200/50 p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 card-enter">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-200">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                change > 0 
                  ? 'bg-green-100 text-green-700' 
                  : change < 0 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
              }`}>
                {change > 0 && (
                  <svg className="w-3 h-3\" fill="none\" stroke="currentColor\" viewBox="0 0 24 24">
                    <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                )}
                {change < 0 && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                  </svg>
                )}
                <span>{Math.abs(change)}%</span>
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${currentColor.icon} shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${currentColor.icon.replace('bg-gradient-to-br', 'from-' + color + '-500 to-' + color + '-600')} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(Math.abs(change || 50), 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatsCard;