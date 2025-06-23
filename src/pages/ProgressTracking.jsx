import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import Modal from '../components/ui/Modal';
import StatsCard from '../components/ui/StatsCard';

const ProgressTracking = () => {
  const { members, updateMember } = useApp();
  const { user } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMetric, setFilterMetric] = useState('all');
  const containerRef = useRef(null);

  // Find trainer's assigned members
  const trainerId = user.trainerId || '1'; // Default for demo
  const myMembers = members.filter(member => member.trainerId === trainerId);

  const [progressForm, setProgressForm] = useState({
    weight: '',
    bmi: '',
    bodyFat: '',
    muscleMass: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

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
    return matchesSearch;
  });

  const getProgressStats = () => {
    const totalMembers = myMembers.length;
    const membersWithProgress = myMembers.filter(m => m.progress?.weight?.length > 0).length;
    const avgWeightLoss = myMembers.reduce((sum, member) => {
      const weights = member.progress?.weight || [];
      if (weights.length >= 2) {
        const firstWeight = weights[0].value;
        const lastWeight = weights[weights.length - 1].value;
        return sum + (firstWeight - lastWeight);
      }
      return sum;
    }, 0) / membersWithProgress || 0;

    const improvingMembers = myMembers.filter(member => {
      const weights = member.progress?.weight || [];
      if (weights.length >= 2) {
        const firstWeight = weights[0].value;
        const lastWeight = weights[weights.length - 1].value;
        return lastWeight < firstWeight; // Weight loss is improvement
      }
      return false;
    }).length;

    return { totalMembers, membersWithProgress, avgWeightLoss, improvingMembers };
  };

  const handleViewProgress = (member) => {
    setSelectedMember(member);
    setShowProgressModal(true);
  };

  const handleAddProgress = (member) => {
    setSelectedMember(member);
    setProgressForm({
      weight: '',
      bmi: '',
      bodyFat: '',
      muscleMass: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddProgressModal(true);
  };

  const handleSubmitProgress = (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    const newProgressEntry = {
      date: progressForm.date,
      weight: parseFloat(progressForm.weight) || null,
      bmi: parseFloat(progressForm.bmi) || null,
      bodyFat: parseFloat(progressForm.bodyFat) || null,
      muscleMass: parseFloat(progressForm.muscleMass) || null,
      notes: progressForm.notes
    };

    const currentProgress = selectedMember.progress || { weight: [], bmi: [], bodyFat: [], muscleMass: [] };
    
    const updatedProgress = {
      ...currentProgress,
      weight: newProgressEntry.weight ? [...(currentProgress.weight || []), { date: progressForm.date, value: newProgressEntry.weight }] : currentProgress.weight,
      bmi: newProgressEntry.bmi ? [...(currentProgress.bmi || []), { date: progressForm.date, value: newProgressEntry.bmi }] : currentProgress.bmi,
      bodyFat: newProgressEntry.bodyFat ? [...(currentProgress.bodyFat || []), { date: progressForm.date, value: newProgressEntry.bodyFat }] : currentProgress.bodyFat,
      muscleMass: newProgressEntry.muscleMass ? [...(currentProgress.muscleMass || []), { date: progressForm.date, value: newProgressEntry.muscleMass }] : currentProgress.muscleMass
    };

    updateMember(selectedMember.id, { progress: updatedProgress });
    toast.success('Progress updated successfully!');
    setShowAddProgressModal(false);
  };

  const getProgressTrend = (member, metric) => {
    const data = member.progress?.[metric] || [];
    if (data.length < 2) return 'stable';
    
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    
    if (metric === 'weight' || metric === 'bodyFat') {
      return latest < previous ? 'improving' : latest > previous ? 'declining' : 'stable';
    } else {
      return latest > previous ? 'improving' : latest < previous ? 'declining' : 'stable';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return { icon: 'M7 17l9.2-9.2M17 17V7H7', color: 'text-green-500' };
      case 'declining':
        return { icon: 'M17 7l-9.2 9.2M7 7v10h10', color: 'text-red-500' };
      default:
        return { icon: 'M5 12h14', color: 'text-gray-500' };
    }
  };

  const stats = getProgressStats();

  return (
    <div ref={containerRef} className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Progress Tracking
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tracking {myMembers.length} member{myMembers.length !== 1 ? 's' : ''}
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
          title="With Progress Data"
          value={stats.membersWithProgress}
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          change={15}
          color="green"
        />
        <StatsCard
          title="Avg Weight Loss"
          value={`${stats.avgWeightLoss.toFixed(1)} kg`}
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          change={8}
          color="yellow"
        />
        <StatsCard
          title="Improving"
          value={stats.improvingMembers}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          change={12}
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
              value={filterMetric}
              onChange={(e) => setFilterMetric(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="all">All Metrics</option>
              <option value="weight">Weight</option>
              <option value="bmi">BMI</option>
              <option value="bodyFat">Body Fat</option>
              <option value="muscleMass">Muscle Mass</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map((member, index) => {
          const weightTrend = getProgressTrend(member, 'weight');
          const bmiTrend = getProgressTrend(member, 'bmi');
          const weightTrendIcon = getTrendIcon(weightTrend);
          const bmiTrendIcon = getTrendIcon(bmiTrend);

          return (
            <div 
              key={member.id} 
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-large dark:hover:shadow-dark-large hover:-translate-y-1 transition-all duration-300 group card-animate"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    className="w-16 h-16 rounded-2xl object-cover shadow-medium group-hover:shadow-large transition-all duration-200"
                    src={member.profileImage}
                    alt={member.name}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{member.membershipType} Member</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Joined {member.joinDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Weight</span>
                      <svg className={`w-4 h-4 ${weightTrendIcon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={weightTrendIcon.icon} />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {member.progress?.weight?.[member.progress.weight.length - 1]?.value || 'N/A'}
                      {member.progress?.weight?.[member.progress.weight.length - 1]?.value && ' kg'}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
                      <svg className={`w-4 h-4 ${bmiTrendIcon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={bmiTrendIcon.icon} />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {member.progress?.bmi?.[member.progress.bmi.length - 1]?.value || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress Timeline</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {member.progress?.weight?.length || 0} entries
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (member.progress?.weight?.length || 0) * 10)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewProgress(member)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddProgress(member)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  >
                    Add Progress
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No members found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No members assigned to you yet.'}
          </p>
        </div>
      )}

      {/* Progress Details Modal */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        title="Progress Details"
        size="xl"
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
                <p className="text-gray-600 dark:text-gray-400">Progress History</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Weight Progress</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedMember.progress?.weight?.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{entry.value} kg</span>
                    </div>
                  )) || <p className="text-gray-500 dark:text-gray-400">No weight data available</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">BMI Progress</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedMember.progress?.bmi?.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{entry.value}</span>
                    </div>
                  )) || <p className="text-gray-500 dark:text-gray-400">No BMI data available</p>}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Progress Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedMember.progress?.weight?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedMember.progress?.attendance || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Progress Modal */}
      <Modal
        isOpen={showAddProgressModal}
        onClose={() => setShowAddProgressModal(false)}
        title="Add Progress Entry"
        size="lg"
      >
        {selectedMember && (
          <form onSubmit={handleSubmitProgress} className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <img
                className="w-12 h-12 rounded-2xl object-cover"
                src={selectedMember.profileImage}
                alt={selectedMember.name}
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedMember.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">Add new progress entry</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={progressForm.date}
                onChange={(e) => setProgressForm({ ...progressForm, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={progressForm.weight}
                  onChange={(e) => setProgressForm({ ...progressForm, weight: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                  placeholder="70.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  BMI
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={progressForm.bmi}
                  onChange={(e) => setProgressForm({ ...progressForm, bmi: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                  placeholder="22.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Body Fat (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={progressForm.bodyFat}
                  onChange={(e) => setProgressForm({ ...progressForm, bodyFat: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                  placeholder="15.0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Muscle Mass (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={progressForm.muscleMass}
                  onChange={(e) => setProgressForm({ ...progressForm, muscleMass: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                  placeholder="55.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                rows="3"
                value={progressForm.notes}
                onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white resize-none"
                placeholder="Additional notes about progress..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddProgressModal(false)}
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:shadow-large hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              >
                Add Progress
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ProgressTracking;