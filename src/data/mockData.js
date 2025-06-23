export const mockData = {
  members: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      joinDate: '2024-01-15',
      membershipType: 'Premium',
      status: 'active',
      trainerId: '1',
      profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      progress: {
        weight: [{ date: '2024-01-15', value: 80 }, { date: '2024-02-15', value: 78 }],
        bmi: [{ date: '2024-01-15', value: 25.5 }, { date: '2024-02-15', value: 24.8 }],
        attendance: 85
      }
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1234567891',
      joinDate: '2024-02-01',
      membershipType: 'Basic',
      status: 'active',
      trainerId: '2',
      profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      progress: {
        weight: [{ date: '2024-02-01', value: 65 }, { date: '2024-03-01', value: 63 }],
        bmi: [{ date: '2024-02-01', value: 22.1 }, { date: '2024-03-01', value: 21.4 }],
        attendance: 92
      }
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1234567892',
      joinDate: '2024-03-10',
      membershipType: 'Premium',
      status: 'active',
      trainerId: '1',
      profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      progress: {
        weight: [{ date: '2024-03-10', value: 90 }, { date: '2024-04-10', value: 88 }],
        bmi: [{ date: '2024-03-10', value: 27.2 }, { date: '2024-04-10', value: 26.6 }],
        attendance: 78
      }
    }
  ],
  
  trainers: [
    {
      id: '1',
      name: 'Alex Wilson',
      email: 'alex.wilson@gym.com',
      phone: '+1234567893',
      specialty: 'Weight Training',
      experience: '5 years',
      status: 'active',
      joinDate: '2023-01-01',
      profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      assignedMembers: ['1', '3']
    },
    {
      id: '2',
      name: 'Sarah Brown',
      email: 'sarah.brown@gym.com',
      phone: '+1234567894',
      specialty: 'Cardio & Yoga',
      experience: '3 years',
      status: 'active',
      joinDate: '2023-06-15',
      profileImage: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=150',
      assignedMembers: ['2']
    },
    {
      id: '3',
      name: 'David Lee',
      email: 'david.lee@gym.com',
      phone: '+1234567895',
      specialty: 'CrossFit',
      experience: '7 years',
      status: 'active',
      joinDate: '2022-03-20',
      profileImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
      assignedMembers: []
    }
  ],
  
  classes: [
    {
      id: '1',
      name: 'Morning Yoga',
      trainer: 'Sarah Brown',
      trainerId: '2',
      time: '07:00',
      duration: 60,
      date: '2024-12-20',
      maxCapacity: 20,
      currentCapacity: 15,
      type: 'Yoga',
      description: 'Start your day with energizing yoga poses'
    },
    {
      id: '2',
      name: 'HIIT Workout',
      trainer: 'Alex Wilson',
      trainerId: '1',
      time: '18:00',
      duration: 45,
      date: '2024-12-20',
      maxCapacity: 15,
      currentCapacity: 12,
      type: 'HIIT',
      description: 'High intensity interval training for maximum results'
    },
    {
      id: '3',
      name: 'CrossFit Session',
      trainer: 'David Lee',
      trainerId: '3',
      time: '19:00',
      duration: 75,
      date: '2024-12-21',
      maxCapacity: 12,
      currentCapacity: 8,
      type: 'CrossFit',
      description: 'Functional fitness training with varied movements'
    }
  ],
  
  payments: [
    {
      id: '1',
      memberId: '1',
      memberName: 'John Doe',
      amount: 99.99,
      date: '2024-12-01',
      type: 'Monthly Membership',
      status: 'completed',
      method: 'Credit Card'
    },
    {
      id: '2',
      memberId: '2',
      memberName: 'Jane Smith',
      amount: 59.99,
      date: '2024-12-01',
      type: 'Monthly Membership',
      status: 'completed',
      method: 'Bank Transfer'
    },
    {
      id: '3',
      memberId: '3',
      memberName: 'Mike Johnson',
      amount: 99.99,
      date: '2024-12-05',
      type: 'Monthly Membership',
      status: 'pending',
      method: 'Credit Card'
    }
  ],
  
  notifications: [
    {
      id: '1',
      title: 'Welcome New Member',
      message: 'Mike Johnson has joined the gym!',
      type: 'info',
      timestamp: '2024-12-19T10:30:00Z',
      read: false
    },
    {
      id: '2',
      title: 'Payment Reminder',
      message: 'Monthly payments are due in 3 days',
      type: 'warning',
      timestamp: '2024-12-19T09:15:00Z',
      read: false
    },
    {
      id: '3',
      title: 'Class Full',
      message: 'HIIT Workout class is now full',
      type: 'success',
      timestamp: '2024-12-19T08:45:00Z',
      read: true
    }
  ],
  
  leads: [
    {
      id: '1',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1234567896',
      source: 'Website',
      status: 'new',
      followUpDate: '2024-12-21',
      notes: 'Interested in personal training sessions'
    },
    {
      id: '2',
      name: 'Robert Davis',
      email: 'robert.davis@email.com',
      phone: '+1234567897',
      source: 'Referral',
      status: 'contacted',
      followUpDate: '2024-12-22',
      notes: 'Looking for weight loss program'
    }
  ]
};

// Mock users for authentication
export const mockUsers = [
  {
    id: '1',
    email: 'admin@gym.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'trainer@gym.com',
    password: 'trainer123',
    name: 'Alex Wilson',
    role: 'trainer'
  },
  {
    id: '3',
    email: 'member@gym.com',
    password: 'member123',
    name: 'John Doe',
    role: 'member',
    memberId: '1'
  }
];