import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import Modal from '../components/ui/Modal';
import StatsCard from '../components/ui/StatsCard';

const MyMembers = () => {
  const { members, updateMember } = useApp();
  const { user } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const containerRef = useRef(null);

  // Find trainer's assigned members
  const trainerId = user.trainerId || '1'; // Default for demo
  const myMembers = members.filter(member => member.trainerId === trainerId);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const filteredMembers = myMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStats = () => {
    const totalMembers = myMembers.length;
    const activeMembers = myMembers.filter(m => m.status === 'active').length;
    const avgAttendance = myMembers.length > 0 
      ? Math.round(myMembers.reduce((sum, m) => sum + (m.progress?.attendance || 0), 0) / myMembers.length)
      : 0;
    const thisMonthJoined = myMembers.filter(m => {
      const joinDate = new Date(m.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length;

    return { totalMembers, activeMembers, avgAttendance, thisMonthJoined };
  };

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setShowDetailsModal(true);
  };

  const handleViewProgress = (member) => {
    setSelectedMember(member);
    setShowProgressModal(true);
  };

  const handleUpdateProgress = (memberId, newProgress) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      updateMember(memberId, {
        progress: {
          ...member.progress,
          ...newProgress
        }
      });
      toast.success('Progress updated successfully!');
    }
  };

  const stats = getStats();

  return (
    <div ref={containerRef} className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          My Members
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Managing {myMembers.length} member{myMembers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value={stats.totalMembers}
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          change={15}
          color="blue"
        />
        <StatsCard
          title="Active Members"
          value={stats.activeMembers}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          change={8}
          color="green"
        />
        <StatsCard
          title="Avg Attendance"
          value={`${stats.avgAttendance}%`}
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          change={5}
          color="yellow"
        />
        <StatsCard
          title="New This Month"
          value={stats.thisMonthJoined}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          change={20}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member, index) => (
          <div 
            key={member.id} 
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-large dark:hover:shadow-dark-large hover:-translate-y-2 transition-all duration-300 group card-animate"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative">
              <img
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                src={member.profileImage}
                alt={member.name}
              />
              <div className="absolute top-4 right-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {member.status}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  member.membershipType === 'Premium' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                  member.membershipType === 'VIP' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {member.membershipType}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  {member.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded-full ${
                    member.progress?.attendance >= 80 ? 'bg-green-400' :
                    member.progress?.attendance >= 60 ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {member.progress?.attendance || 0}%
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  {member.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {member.joinDate}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {member.progress?.weight?.[member.progress.weight.length - 1]?.value || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Weight</div>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {member.progress?.bmi?.[member.progress.bmi.length - 1]?.value || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">BMI</div>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {member.progress?.attendance || 0}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Attend</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(member)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  Details
                </button>
                <button
                  onClick={() => handleViewProgress(member)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                >
                  Progress
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No members found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No members assigned to you yet.'}
          </p>
        </div>
      )}

      {/* Member Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Member Details"
        size="lg"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <img
                className="w-24 h-24 rounded-3xl object-cover shadow-medium"
                src={selectedMember.profileImage}
                alt={selectedMember.name}
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMember.name}</h3>
                <p className="text-lg text-primary-600 dark:text-primary-400">{selectedMember.membershipType} Member</p>
                <p className="text-gray-600 dark:text-gray-400">Joined {selectedMember.joinDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMember.progress?.attendance || 0}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMember.progress?.weight?.[selectedMember.progress.weight.length - 1]?.value || 'N/A'} kg
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Weight</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white">{selectedMember.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="text-gray-900 dark:text-white">{selectedMember.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Membership:</span>
                <span className="text-gray-900 dark:text-white">{selectedMember.membershipType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`font-medium ${
                  selectedMember.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {selectedMember.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Progress Modal */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        title="Member Progress"
        size="lg"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                className="w-16 h-16 rounded-2xl object-cover"
                src={selectedMember.profileImage}
                alt={selectedMember.name}
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMember.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">Progress Tracking</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Weight Progress</h4>
                <div className="space-y-2">
                  {selectedMember.progress?.weight?.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{entry.value} kg</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">BMI Progress</h4>
                <div className="space-y-2">
                  {selectedMember.progress?.bmi?.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Attendance Rate</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${selectedMember.progress?.attendance || 0}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedMember.progress?.attendance || 0}%
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  toast.success('Progress notes updated!');
                  setShowProgressModal(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-medium hover:shadow-large hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              >
                Update Progress
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyMembers;