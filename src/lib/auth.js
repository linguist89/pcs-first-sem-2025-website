'use client';

// Mock user data
const MOCK_USERS = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'contact@spsdigitaltech.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    progress: {
      completedLessons: ['lesson-1', 'lesson-2'],
      currentLesson: 'lesson-3',
      lastAccessed: '2023-04-15T10:30:00Z'
    }
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'contact@spsdigitaltech.com',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    progress: {
      completedLessons: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4'],
      currentLesson: 'lesson-5',
      lastAccessed: '2023-04-16T14:20:00Z'
    }
  },
  {
    id: 'user-3',
    name: 'Guest User',
    email: 'contact@spsdigitaltech.com',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    progress: {
      completedLessons: [],
      currentLesson: 'lesson-1',
      lastAccessed: '2023-04-17T09:10:00Z'
    }
  }
];

// Mock authentication functions
export async function signIn(email, password) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(user => user.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, we would verify the password here
  
  // Store user data in localStorage
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  return user;
}

export async function signOut() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Remove user data from localStorage
  localStorage.removeItem('currentUser');
  
  return { success: true };
}

export function getCurrentUser() {
  // In a real app with SSR, we would use cookies or server-side sessions
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userJson = localStorage.getItem('currentUser');
  
  if (!userJson) {
    return null;
  }
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

export async function updateUserProgress(userId, lessonId, isCompleted = true) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const currentUser = getCurrentUser();
  
  if (!currentUser || currentUser.id !== userId) {
    throw new Error('Unauthorized');
  }
  
  const updatedProgress = { ...currentUser.progress };
  
  if (isCompleted) {
    // Add to completed lessons if not already there
    if (!updatedProgress.completedLessons.includes(lessonId)) {
      updatedProgress.completedLessons = [...updatedProgress.completedLessons, lessonId];
    }
    
    // Update current lesson to next lesson (simplified logic)
    const lessonNumber = parseInt(lessonId.split('-')[1]);
    updatedProgress.currentLesson = `lesson-${lessonNumber + 1}`;
  } else {
    // Set as current lesson
    updatedProgress.currentLesson = lessonId;
  }
  
  updatedProgress.lastAccessed = new Date().toISOString();
  
  // Update user in localStorage
  const updatedUser = {
    ...currentUser,
    progress: updatedProgress
  };
  
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  
  return updatedUser;
}

export async function getUserProfile(userId) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = MOCK_USERS.find(user => user.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
} 