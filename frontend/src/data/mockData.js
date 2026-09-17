/**
 * Nami — Mock Data
 * Clean separation of mock data from application logic.
 * Replace these with Django API calls when backend is integrated.
 */

// Default timer durations (in seconds)
export const TIMER_DEFAULTS = {
  focus: 25 * 60,       // 25 minutes
  shortBreak: 5 * 60,   // 5 minutes
  longBreak: 15 * 60,   // 15 minutes
};

// Timer mode labels
export const MODE_LABELS = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

// Motivational quotes
export const QUOTES = [
  {
    text: '"The sea does not rush, yet it reaches every shore."',
    author: 'The Ocean',
  },
  {
    text: '"A smooth sea never made a skilled sailor."',
    author: 'Franklin D. Roosevelt',
  },
  {
    text: '"The journey of a thousand miles begins with a single step."',
    author: 'Lao Tzu',
  },
  {
    text: '"Still waters run deep."',
    author: 'Proverb',
  },
  {
    text: '"You can\'t cross the sea by standing and staring at the water."',
    author: 'Rabindranath Tagore',
  },
  {
    text: '"The ocean stirs the heart, inspires the imagination."',
    author: 'Wyland',
  },
  {
    text: '"Set your course by the stars, not by the lights of every passing ship."',
    author: 'Omar Bradley',
  },
  {
    text: '"In one drop of water are found all the secrets of the oceans."',
    author: 'Kahlil Gibran',
  },
];

// Music options — audioUrl points to free CC0 ambient loops
// These are small, royalty-free audio files suitable for background playback
export const MUSIC_OPTIONS = [
  {
    id: 'ocean-waves',
    label: 'Ocean Waves',
    icon: '🌊',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3',
  },
  {
    id: 'calm-piano',
    label: 'Calm Piano',
    icon: '🎹',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/09/04/audio_4e4c0c3c11.mp3',
  },
  {
    id: 'rain',
    label: 'Rain',
    icon: '🌧️',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/10/30/audio_f2febe3e26.mp3',
  },
  {
    id: 'ambient',
    label: 'Ambient',
    icon: '🎵',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/11/01/audio_1f0e872fa3.mp3',
  },
  { id: 'none', label: 'None', icon: '🔇', audioUrl: null },
];

// Mock user profile
export const MOCK_USER = {
  id: 'u-001',
  username: 'Amar',
  email: 'amar@example.com',
  avatar: null,
  stats: {
    totalFocusTime: 1250, // minutes
    completedSessions: 50,
    currentStreak: 7,
  },
};

// Mock leaderboard
export const MOCK_LEADERBOARD = [
  { id: 'u-010', username: 'Alex', sessions: 18, isYou: false },
  { id: 'u-011', username: 'Maya', sessions: 16, isYou: false },
  { id: 'u-001', username: 'You', sessions: 14, isYou: true },
  { id: 'u-012', username: 'Sam', sessions: 12, isYou: false },
  { id: 'u-013', username: 'Priya', sessions: 9, isYou: false },
];

// Mock tasks
export const MOCK_TASKS = [
  { id: 't-001', title: 'Study Mathematics', completed: false, createdAt: new Date().toISOString() },
  { id: 't-002', title: 'Complete Django assignment', completed: false, createdAt: new Date().toISOString() },
  { id: 't-003', title: 'Review Physics notes', completed: true, createdAt: new Date().toISOString() },
];
