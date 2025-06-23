import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import Modal from '../components/ui/Modal';
import StatsCard from '../components/ui/StatsCard';

const MyWorkouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([
    {
      id: '1',
      name: 'Upper Body Strength',
      type: 'Strength',
      duration: 45,
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 10, weight: 80 },
        { name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
        { name: 'Shoulder Press', sets: 3, reps: 12, weight: 25 },
        { name: 'Bicep Curls', sets: 3, reps: 15, weight: 15 }
      ],
      date: '2024-12-19',
      completed: true,
      notes: 'Great session, increased weight on bench press'
    },
    {
      id: '2',
      name: 'Cardio HIIT',
      type: 'Cardio',
      duration: 30,
      exercises: [
        { name: 'Burpees', sets: 4, reps: 10, weight: 0 },
        { name: 'Mountain Climbers', sets: 4, reps: 20, weight: 0 },
        { name: 'Jump Squats', sets: 4, reps: 15, weight: 0 },
        { name: 'High Knees', sets: 4, reps: 30, weight: 0 }
      ],
      date: '2024-12-18',
      completed: true,
      notes: 'Intense session, felt great afterwards'
    },
    {
      id: '3',
      name: 'Lower Body Power',
      type: 'Strength',
      duration: 50,
      exercises: [
        { name: 'Squats', sets: 4, reps: 12, weight: 100 },
        { name: 'Deadlifts', sets: 3, reps: 8, weight: 120 },
        { name: 'Lunges', sets: 3, reps: 10, weight: 20 },
        { name: 'Calf Raises', sets: 3, reps: 20, weight: 40 }
      ],
      date: '2024-12-20',
      completed: false,
      notes: ''
    }
  ]);

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const containerRef = useRef(null);

  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: 'Strength',
    duration: 30,
    exercises: [{ name: '', sets: 3, reps: 10, weight: 0 }],
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const filteredWorkouts = workouts.filter(workout => {
    const matchesType = filterType === 'all' || workout.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && workout.completed) ||
      (filterStatus === 'pending' && !workout.completed);
    return matchesType && matchesStatus;
  });

  const getWorkoutStats = () => {
    const totalWorkouts = workouts.length;
    const completedWorkouts = workouts.filter(w => w.completed).length;
    const totalDuration = workouts.filter(w => w.completed).reduce((sum, w) => sum + w.duration, 0);
    const thisWeekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return workoutDate >= weekAgo && workoutDate <= now && w.completed;
    }).length;

    return { totalWorkouts, completedWorkouts, totalDuration, thisWeekWorkouts };
  };

  const handleViewWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutModal(true);
  };

  const handleCompleteWorkout = (workoutId) => {
    setWorkouts(workouts.map(workout => 
      workout.id === workoutId 
        ? { ...workout, completed: true, date: new Date().toISOString().split('T')[0] }
        : workout
    ));
    toast.success('Workout completed! Great job! 💪');
  };

  const handleCreateWorkout = (e) => {
    e.preventDefault();
    const workout = {
      ...newWorkout,
      id: Date.now().toString(),
      completed: false
    };
    setWorkouts([...workouts, workout]);
    setNewWorkout({
      name: '',
      type: 'Strength',
      duration: 30,
      exercises: [{ name: '', sets: 3, reps: 10, weight: 0 }],
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowCreateModal(false);
    toast.success('Workout created successfully!');
  };

  const addExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, { name: '', sets: 3, reps: 10, weight: 0 }]
    });
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = newWorkout.exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const removeExercise = (index) => {
    if (newWorkout.exercises.length > 1) {
      const updatedExercises = newWorkout.exercises.filter((_, i) => i !== index);
      setNewWorkout({ ...newWorkout, exercises: updatedExercises });
    }
  };

  const stats = getWorkoutStats();

  return (
    <div ref={containerRef} className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          My Workouts
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold shadow-medium hover:shadow-large hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
        >
          Create Workout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon="M13 10V3L4 14h7v7l9-11h-7z"
          change={15}
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={stats.completedWorkouts}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          change={20}
          color="green"
        />
        <StatsCard
          title="Total Duration"
          value={`${stats.totalDuration} min`}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          change={12}
          color="yellow"
        />
        <StatsCard
          title="This Week"
          value={stats.thisWeekWorkouts}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          change={25}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="HIIT">HIIT</option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map((workout, index) => (
          <div 
            key={workout.id} 
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft dark:shadow-dark-soft border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-large dark:hover:shadow-dark-large hover:-translate-y-2 transition-all duration-300 group card-animate"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  {workout.name}
                </h3>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  workout.completed 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {workout.completed ? 'Completed' : 'Pending'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {workout.type}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {workout.duration} minutes
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {workout.date}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                </div>
                <div className="space-y-1">
                  {workout.exercises.slice(0, 3).map((exercise, i) => (
                    <div key={i} className="text-sm text-gray-700 dark:text-gray-300">
                      {exercise.name} - {exercise.sets}x{exercise.reps}
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      +{workout.exercises.length - 3} more...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewWorkout(workout)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  View Details
                </button>
                {!workout.completed && (
                  <button
                    onClick={() => handleCompleteWorkout(workout.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No workouts found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create your first workout to get started!
          </p>
        </div>
      )}

      {/* Workout Details Modal */}
      <Modal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        title="Workout Details"
        size="lg"
      >
        {selectedWorkout && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedWorkout.name}</h3>
                <p className="text-lg text-primary-600 dark:text-primary-400">{selectedWorkout.type} • {selectedWorkout.duration} min</p>
              </div>
              <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                selectedWorkout.completed 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {selectedWorkout.completed ? 'Completed' : 'Pending'}
              </span>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Exercises</h4>
              <div className="space-y-3">
                {selectedWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {exercise.sets}×{exercise.reps}
                      </div>
                      {exercise.weight > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">{exercise.weight}kg</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedWorkout.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  {selectedWorkout.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              {!selectedWorkout.completed && (
                <button
                  onClick={() => {
                    handleCompleteWorkout(selectedWorkout.id);
                    setShowWorkoutModal(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-medium hover:shadow-large hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Create Workout Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Workout"
        size="xl"
      >
        <form onSubmit={handleCreateWorkout} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Workout Name
              </label>
              <input
                type="text"
                required
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                placeholder="Upper Body Strength"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={newWorkout.type}
                onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibility">Flexibility</option>
                <option value="HIIT">HIIT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                required
                min="5"
                max="180"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                required
                value={newWorkout.date}
                onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Exercises</h4>
              <button
                type="button"
                onClick={addExercise}
                className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              >
                Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {newWorkout.exercises.map((exercise, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Sets"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Reps"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      min="0"
                      step="0.5"
                      value={exercise.weight}
                      onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    />
                    {newWorkout.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              rows="3"
              value={newWorkout.notes}
              onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white resize-none"
              placeholder="Additional notes about this workout..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:shadow-large hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            >
              Create Workout
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyWorkouts;