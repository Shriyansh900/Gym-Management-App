import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/ui/StatsCard';

const DashboardMember = () => {
  const { members, classes } = useApp();
  const { user } = useAuth();

  // Find current member's data
  const memberData = members.find(member => member.id === user.memberId) || members[0];
  
  const bookedClasses = classes.filter(cls => 
    cls.bookedMembers?.includes(memberData.id)
  );
  
  const upcomingClasses = bookedClasses.filter(cls => 
    new Date(cls.date) >= new Date()
  ).slice(0, 3);

  const todayClasses = bookedClasses.filter(cls => 
    cls.date === new Date().toISOString().split('T')[0]
  );

  const recentProgress = memberData.progress.weight.slice(-2);
  const weightChange = recentProgress.length > 1 ? 
    recentProgress[1].value - recentProgress[0].value : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {memberData.name}! Keep up the great work!
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Classes Booked"
          value={bookedClasses.length}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          change={10}
          color="blue"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${memberData.progress.attendance}%`}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          change={memberData.progress.attendance > 80 ? 5 : -2}
          color="green"
        />
        <StatsCard
          title="Current Weight"
          value={`${recentProgress[recentProgress.length - 1]?.value || 0} kg`}
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          change={weightChange}
          color="yellow"
        />
        <StatsCard
          title="Today's Classes"
          value={todayClasses.length}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          change={0}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
          </div>
          <div className="p-6">
            {upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{cls.name}</h3>
                        <p className="text-sm text-gray-500">with {cls.trainer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{cls.time}</p>
                        <p className="text-xs text-gray-500">{cls.date}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cls.type === 'Yoga' ? 'bg-green-100 text-green-800' :
                        cls.type === 'HIIT' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {cls.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming classes</h3>
                <p className="mt-1 text-sm text-gray-500">Book a class to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Weight Progress</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {memberData.progress.weight.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{entry.value} kg</p>
                    {index > 0 && (
                      <p className={`text-sm ${
                        entry.value < memberData.progress.weight[index - 1].value 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.value < memberData.progress.weight[index - 1].value ? '↓' : '↑'} 
                        {Math.abs(entry.value - memberData.progress.weight[index - 1].value)} kg
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-center">
              <div className="text-primary-600 mb-2 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Book Class</h3>
            </button>

            <button className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center">
              <div className="text-secondary-600 mb-2 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">View Progress</h3>
            </button>

            <button className="p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors text-center">
              <div className="text-accent-600 mb-2 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">My Workouts</h3>
            </button>

            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
              <div className="text-purple-600 mb-2 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Membership</h3>
            </button>
          </div>
        </div>
      </div>

      {/* Membership Status */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Membership Status</h3>
            <p className="text-primary-100">{memberData.membershipType} Plan</p>
            <p className="text-sm text-primary-200 mt-1">
              Member since {new Date(memberData.joinDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Active</div>
            <button className="mt-2 px-4 py-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors text-sm">
              Renew Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMember;