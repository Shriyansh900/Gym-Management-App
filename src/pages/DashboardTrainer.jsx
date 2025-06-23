import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/ui/StatsCard';

const DashboardTrainer = () => {
  const { members, classes } = useApp();
  const { user } = useAuth();

  // Find current trainer's data
  const trainerData = {
    id: '1', // This would normally come from user.trainerId
    name: user.name
  };

  const assignedMembers = members.filter(member => member.trainerId === trainerData.id);
  const myClasses = classes.filter(cls => cls.trainerId === trainerData.id);
  const todayClasses = myClasses.filter(cls => cls.date === new Date().toISOString().split('T')[0]);
  const totalAttendance = assignedMembers.reduce((sum, member) => sum + member.progress.attendance, 0) / assignedMembers.length || 0;

  const upcomingClasses = myClasses.filter(cls => new Date(cls.date) >= new Date()).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
        <div className="text-sm text-gray-500">
          Good morning, {user.name}! Ready to train today?
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Assigned Members"
          value={assignedMembers.length}
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          change={15}
          color="blue"
        />
        <StatsCard
          title="Today's Classes"
          value={todayClasses.length}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          change={0}
          color="green"
        />
        <StatsCard
          title="Avg Attendance"
          value={`${totalAttendance.toFixed(0)}%`}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          change={5}
          color="yellow"
        />
        <StatsCard
          title="Total Classes"
          value={myClasses.length}
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          change={20}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Members */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Members</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {assignedMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={member.profileImage}
                    alt={member.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.membershipType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{member.progress.attendance}%</p>
                    <p className="text-xs text-gray-500">Attendance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-500">{cls.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{cls.time}</p>
                      <p className="text-xs text-gray-500">{cls.date}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {cls.currentCapacity}/{cls.maxCapacity} booked
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(cls.currentCapacity / cls.maxCapacity) * 100}%` }}
                      ></div>
                    </div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Mark Attendance</h3>
            </button>

            <button className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center">
              <div className="text-secondary-600 mb-2 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Assign Workout</h3>
            </button>

            <button className="p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors text-center">
              <div className="text-accent-600 mb-2 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Track Progress</h3>
            </button>

            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
              <div className="text-purple-600 mb-2 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Schedule Class</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTrainer;