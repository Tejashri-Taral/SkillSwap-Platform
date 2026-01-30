export const API_BASE_URL = 'http://localhost:8080/api';

export const SKILL_CATEGORIES = [
  'Programming',
  'Design',
  'Music',
  'Language',
  'Business',
  'Art',
  'Writing',
  'Marketing',
  'Data Science',
  'Mathematics',
  'Science',
  'Sports',
  'Cooking',
  'Photography',
  'Other'
];

export const MEETING_PLATFORMS = [
  'Google Meet',
  'Zoom',
  'Microsoft Teams',
  'Jitsi',
  'Discord',
  'Skype',
  'Other'
];

export const SKILL_LEVELS = [
  { value: 1, label: 'Beginner (1 star)' },
  { value: 2, label: 'Intermediate (2 stars)' },
  { value: 3, label: 'Advanced (3 stars)' },
  { value: 4, label: 'Expert (4 stars)' },
  { value: 5, label: 'Master (5 stars)' }
];

export const SESSION_STATUS = {
  CREATED: 'CREATED',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};