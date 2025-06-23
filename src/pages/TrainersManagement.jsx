import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import Modal from '../components/ui/Modal';
import StatsCard from '../components/ui/StatsCard';

const TrainersManagement = () => {
  const { trainers, members, addTrainer, updateTrainer, deleteTrainer } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'Weight Training',
    experience: '',
    certification: '',
    hourlyRate: '',
    bio: '',
    profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
  });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || trainer.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getTrainerStats = (trainerId) => {
    const assignedMembers = members.filter(member => member.trainerId === trainerId);
    const avgAttendance = assignedMembers.length > 0 
      ? assignedMembers.reduce((sum, member) => sum + (member.progress?.attendance || 0), 0) / assignedMembers.length 
      : 0;
    
    return {
      totalMembers: assignedMembers.length,
      avgAttendance: Math.round(avgAttendance),
      activeMembers: assignedMembers.filter(member => member.status === 'active').length
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTrainer) {
      updateTrainer(editingTrainer.id, formData);
      toast.success('Trainer updated successfully!');
    } else {
      addTrainer(formData);
      toast.success('Trainer added successfully!');
    }
    resetForm();
  };

  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      email: trainer.email || '',
      phone: trainer.phone || '',
      specialty: trainer.specialty,
      experience: trainer.experience,
      certification: trainer.certification || '',
      hourlyRate: trainer.hourlyRate || '',
      bio: trainer.bio || '',
      profileImage: trainer.profileImage
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      deleteTrainer(id);
      toast.success('Trainer deleted successfully!');
    }
  };

  const handleViewDetails = (trainer) => {
    setSelectedTrainer(trainer);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: 'Weight Training',
      experience: '',
      certification: '',
      hourlyRate: '',
      bio: '',
      profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
    });
    setEditingTrainer(null);
    setShowModal(false);
  };

  const specialties = ['Weight Training', 'Cardio & Yoga', 'CrossFit', 'Personal Training', 'Group Fitness', 'Nutrition'];

  return (
    <div ref={containerRef} className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Trainers Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-medium hover:shadow-large hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
        >
          Add Trainer
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Trainers"
          value={trainers.length}
          icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          change={12}
          color="blue"
        />
        <StatsCard
          title="Active Trainers"
          value={trainers.filter(t => t.status === 'active').length}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          change={5}
          color="green"
        />
        <StatsCard
          title="Specialties"
          value={new Set(trainers.map(t => t.specialty)).size}
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          change={2}
          color="purple"
        />
        <StatsCard
          title="Avg Experience"
          value={`${Math.round(trainers.reduce((sum, t) => sum + parseInt(t.experience || 0), 0) / trainers.length || 0)} yrs`}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          change={8}
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="all">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer, index) => {
          const stats = getTrainerStats(trainer.id);
          return (
            <div 
              key={trainer.id} 
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-large dark:hover:shadow-dark-large hover:-translate-y-2 transition-all duration-300 group card-animate"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  src={trainer.profileImage}
                  alt={trainer.name}
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    trainer.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {trainer.status || 'active'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {trainer.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {trainer.specialty}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {trainer.experience} experience
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {stats.totalMembers} members
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalMembers}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.avgAttendance}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Attendance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.activeMembers}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(trainer)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(trainer)}
                    className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trainer.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="Enter trainer name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="trainer@gym.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Specialty
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Experience
              </label>
              <input
                type="text"
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="5 years"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Hourly Rate
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Certification
            </label>
            <input
              type="text"
              value={formData.certification}
              onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              placeholder="ACSM, NASM, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              rows="4"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white resize-none"
              placeholder="Brief description about the trainer..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:shadow-large hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            >
              {editingTrainer ? 'Update' : 'Add'} Trainer
            </button>
          </div>
        </form>
      </Modal>

      {/* Trainer Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Trainer Details"
        size="lg"
      >
        {selectedTrainer && (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <img
                className="w-24 h-24 rounded-3xl object-cover shadow-medium"
                src={selectedTrainer.profileImage}
                alt={selectedTrainer.name}
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTrainer.name}</h3>
                <p className="text-lg text-primary-600 dark:text-primary-400">{selectedTrainer.specialty}</p>
                <p className="text-gray-600 dark:text-gray-400">{selectedTrainer.experience} experience</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{getTrainerStats(selectedTrainer.id).totalMembers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Members</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{getTrainerStats(selectedTrainer.id).avgAttendance}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</div>
              </div>
            </div>

            {selectedTrainer.bio && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedTrainer.bio}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white">{selectedTrainer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="text-gray-900 dark:text-white">{selectedTrainer.phone}</span>
              </div>
              {selectedTrainer.certification && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Certification:</span>
                  <span className="text-gray-900 dark:text-white">{selectedTrainer.certification}</span>
                </div>
              )}
              {selectedTrainer.hourlyRate && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Hourly Rate:</span>
                  <span className="text-gray-900 dark:text-white">${selectedTrainer.hourlyRate}/hr</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainersManagement;