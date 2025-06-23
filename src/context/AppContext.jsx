import { createContext, useContext, useState } from 'react';
import { mockData } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [members, setMembers] = useState(mockData.members);
  const [trainers, setTrainers] = useState(mockData.trainers);
  const [classes, setClasses] = useState(mockData.classes);
  const [payments, setPayments] = useState(mockData.payments);
  const [notifications, setNotifications] = useState(mockData.notifications);
  const [leads, setLeads] = useState(mockData.leads);

  // Member management
  const addMember = (member) => {
    const newMember = {
      ...member,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (id, updatedMember) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, ...updatedMember } : member
    ));
  };

  const deleteMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  // Trainer management
  const addTrainer = (trainer) => {
    const newTrainer = {
      ...trainer,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setTrainers([...trainers, newTrainer]);
  };

  const updateTrainer = (id, updatedTrainer) => {
    setTrainers(trainers.map(trainer => 
      trainer.id === id ? { ...trainer, ...updatedTrainer } : trainer
    ));
  };

  const deleteTrainer = (id) => {
    setTrainers(trainers.filter(trainer => trainer.id !== id));
  };

  // Class management
  const addClass = (classData) => {
    const newClass = {
      ...classData,
      id: Date.now().toString(),
      currentCapacity: 0
    };
    setClasses([...classes, newClass]);
  };

  const updateClass = (id, updatedClass) => {
    setClasses(classes.map(cls => 
      cls.id === id ? { ...cls, ...updatedClass } : cls
    ));
  };

  const deleteClass = (id) => {
    setClasses(classes.filter(cls => cls.id !== id));
  };

  // Booking management
  const bookClass = (classId, memberId) => {
    setClasses(classes.map(cls => {
      if (cls.id === classId && cls.currentCapacity < cls.maxCapacity) {
        return {
          ...cls,
          currentCapacity: cls.currentCapacity + 1,
          bookedMembers: [...(cls.bookedMembers || []), memberId]
        };
      }
      return cls;
    }));
  };

  const cancelBooking = (classId, memberId) => {
    setClasses(classes.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          currentCapacity: Math.max(0, cls.currentCapacity - 1),
          bookedMembers: (cls.bookedMembers || []).filter(id => id !== memberId)
        };
      }
      return cls;
    }));
  };

  // Payment management
  const addPayment = (payment) => {
    const newPayment = {
      ...payment,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    setPayments([...payments, newPayment]);
  };

  // Notification management
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const value = {
    // Data
    members,
    trainers,
    classes,
    payments,
    notifications,
    leads,
    
    // Member functions
    addMember,
    updateMember,
    deleteMember,
    
    // Trainer functions
    addTrainer,
    updateTrainer,
    deleteTrainer,
    
    // Class functions
    addClass,
    updateClass,
    deleteClass,
    bookClass,
    cancelBooking,
    
    // Payment functions
    addPayment,
    
    // Notification functions
    addNotification,
    markNotificationRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};