import { useApp } from '../context/AppContext';
import StatsCard from '../components/ui/StatsCard';

const DashboardAdmin = () => {
  const { members, trainers, classes, payments, notifications } = useApp();

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const activeMembers = members.filter(member => member.status === 'active').length;
  const upcomingClasses = classes.filter(cls => new Date(cls.date) >= new Date()).length;
  const pendingPayments = payments.filter(payment => payment.status === 'pending').length;

  const recentActivities = [
    { 
      id: 1, 
      type: 'member', 
      action: 'New member joined', 
      details: 'Mike Johnson joined today', 
      time: '2 hours ago',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 2, 
      type: 'payment', 
      action: 'Payment received', 
      details: '$99.99 from John Doe', 
      time: '4 hours ago',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 3, 
      type: 'class', 
      action: 'Class fully booked', 
      details: 'HIIT Workout is at capacity', 
      time: '6 hours ago',
      avatar: null,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 4, 
      type: 'trainer', 
      action: 'Trainer assigned', 
      details: 'Alex Wilson assigned to new member', 
      time: '1 day ago',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const quickActions = [
    {
      title: 'Add Member',
      description: 'Register new member',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Schedule Class',
      description: 'Create new class',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Record Payment',
      description: 'Add payment entry',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100'
    },
    {
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Welcome back! Here's what's happening at your gym today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-2xl px-4 py-2 shadow-soft border border-gray-200">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-600">System Status: </span>
              <span className="font-semibold text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={activeMembers}
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          change={12}
          color="blue"
        />
        <StatsCard
          title="Active Trainers"
          value={trainers.length}
          icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          change={5}
          color="green"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          change={8}
          color="yellow"
        />
        <StatsCard
          title="Upcoming Classes"
          value={upcomingClasses}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          change={-2}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-200/50 overflow-hidden">
            <div className="p-6 lg:p-8 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  View All
                </button>
              </div>
            </div>
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      {activity.avatar ? (
                        <img
                          className="w-12 h-12 rounded-2xl object-cover shadow-medium group-hover:shadow-large transition-all duration-200"
                          src={activity.avatar}
                          alt=""
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${activity.color} flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-200`}>
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="3" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-200/50 overflow-hidden">
            <div className="p-6 lg:p-8 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action, index) => (
                  <button 
                    key={index}
                    className="group p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-medium transition-all duration-300 text-left border border-gray-200/50 hover:border-gray-300/50 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-r ${action.color} shadow-medium group-hover:shadow-large group-hover:scale-110 transition-all duration-300`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                      <div className="text-gray-400 group-hover:text-primary-500 transition-colors duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {pendingPayments > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6 shadow-soft animate-slide-up">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-medium">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800">Payment Reminder</h3>
              <p className="text-yellow-700 mt-1">
                {pendingPayments} member(s) have pending payments. Review and follow up as needed.
              </p>
              <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors duration-200 text-sm font-medium">
                Review Payments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;