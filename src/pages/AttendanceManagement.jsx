import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import StatsCard from '../components/ui/StatsCard';

const AttendanceManagement = () => {
  const { members, classes, updateMember } = useApp();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedClass, setSelectedClass] = useState('all');
  const containerRef = useRef(null);

  // Find trainer's assigned members
  const trainerId = user.trainerId || '1'; // Default for demo
  const myMembers = members.filter(member => member.trainerId === trainerId);
  const todayClasses = classes.filter(cls => cls.date === selectedDate && cls.trainerId === trainerId);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    // Initialize attendance data for selected date
    const initialData = {};
    myMembers.forEach(member => {
      initialData[member.id] = {
        present: false,
        classId: null,
        notes: ''
      };
    });
    setAttendanceData(initialData);
  }, [selectedDate, myMembers]);

  const handleAttendanceChange = (memberId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value
      }
    }));
  };

  const handleSaveAttendance = () => {
    // Update attendance for each member
    Object.entries(attendanceData).forEach(([memberId, data]) => {
      if (data.present) {
        const member = members.find(m => m.id === memberId);
        if (member) {
          // Calculate new attendance rate (simplified)
          const currentAttendance = member.progress?.attendance || 0;
          const newAttendance = Math.min(100, currentAttendance + 2); // Increase by 2%
          
          updateMember(memberId, {
            progress: {
              ...member.progress,
              attendance: newAttendance
            }
          });
        }
      }
    });

    toast.success('Attendance saved successfully!');
  };

  const getAttendanceStats = () => {
    const totalMembers = myMembers.length;
    const presentToday = Object.values(attendanceData).filter(data => data.present).length;
    const attendanceRate = totalMembers > 0 ? Math.round((presentToday / totalMembers) * 100) : 0;
    const avgAttendance = myMembers.length > 0 
      ? Math.round(myMembers.reduce((sum, m) => sum + (m.progress?.attendance || 0), 0) / myMembers.length)
      : 0;

    return { totalMembers, presentToday, attendanceRate, avgAttendance };
  };

  const stats = getAttendanceStats();

  return (
    <div ref={containerRef} className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Attendance Management
        </h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSaveAttendance}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-medium hover:shadow-large hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={stats.totalMembers}
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          change={0}
          color="blue"
        />
        <StatsCard
          title="Present Today"
          value={stats.presentToday}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          change={stats.attendanceRate}
          color="green"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          change={stats.attendanceRate - stats.avgAttendance}
          color="yellow"
        />
        <StatsCard
          title="Avg Attendance"
          value={`${stats.avgAttendance}%`}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          change={5}
          color="purple"
        />
      </div>

      {/* Class Filter */}
      {todayClasses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Filter by Class:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Members</option>
              {todayClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name} - {cls.time}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Attendance List */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-colors duration-300">
        <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Attendance for {new Date(selectedDate).toLocaleDateString()}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Mark attendance for your assigned members
          </p>
        </div>

        <div className="p-6 lg:p-8">
          {myMembers.length > 0 ? (
            <div className="space-y-4">
              {myMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 group card-animate"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-12 h-12 rounded-2xl object-cover shadow-medium group-hover:shadow-large transition-all duration-200"
                      src={member.profileImage}
                      alt={member.name}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.membershipType} • {member.progress?.attendance || 0}% avg attendance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Class Selection */}
                    {todayClasses.length > 0 && (
                      <select
                        value={attendanceData[member.id]?.classId || ''}
                        onChange={(e) => handleAttendanceChange(member.id, 'classId', e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                        disabled={!attendanceData[member.id]?.present}
                      >
                        <option value="">Select Class</option>
                        {todayClasses.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    )}

                    {/* Notes */}
                    <input
                      type="text"
                      placeholder="Notes..."
                      value={attendanceData[member.id]?.notes || ''}
                      onChange={(e) => handleAttendanceChange(member.id, 'notes', e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-32"
                    />

                    {/* Present Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attendanceData[member.id]?.present || false}
                        onChange={(e) => handleAttendanceChange(member.id, 'present', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                        {attendanceData[member.id]?.present ? 'Present' : 'Absent'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No members assigned</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You don't have any members assigned to you yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => {
            const newData = { ...attendanceData };
            myMembers.forEach(member => {
              newData[member.id] = { ...newData[member.id], present: true };
            });
            setAttendanceData(newData);
            toast.success('Marked all members as present!');
          }}
          className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-2xl hover:shadow-medium transition-all duration-200 group"
        >
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-green-800 dark:text-green-200">Mark All Present</span>
          </div>
        </button>

        <button
          onClick={() => {
            const newData = { ...attendanceData };
            myMembers.forEach(member => {
              newData[member.id] = { ...newData[member.id], present: false };
            });
            setAttendanceData(newData);
            toast.info('Marked all members as absent!');
          }}
          className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200 dark:border-red-800 rounded-2xl hover:shadow-medium transition-all duration-200 group"
        >
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-semibold text-red-800 dark:text-red-200">Mark All Absent</span>
          </div>
        </button>

        <button
          onClick={() => {
            const newData = {};
            myMembers.forEach(member => {
              newData[member.id] = { present: false, classId: null, notes: '' };
            });
            setAttendanceData(newData);
            toast.info('Attendance cleared!');
          }}
          className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border border-gray-200 dark:border-gray-600 rounded-2xl hover:shadow-medium transition-all duration-200 group"
        >
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Reset All</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AttendanceManagement;