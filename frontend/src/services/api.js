/**
 * Nami — API Service Layer
 * 
 * Currently returns mock data.
 * Designed to be swapped to real Django REST API calls.
 * 
 * Backend endpoints (from PROJECT_DOCUMENTATION.md):
 *   POST /api/auth/login/
 *   POST /api/auth/register/
 *   POST /api/auth/logout/
 *   GET  /api/profile/me/
 *   GET  /api/friends/
 *   GET  /api/rooms/me/
 *   etc.
 */

import { MOCK_USER, MOCK_LEADERBOARD, MOCK_TASKS } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Construct full API URL
 */
export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

/**
 * Fetch user profile
 * TODO: Replace with GET /api/profile/me/
 */
export async function fetchProfile() {
  // return await fetch(apiUrl('/api/profile/me/'), { headers: authHeaders() }).then(r => r.json());
  return { ...MOCK_USER };
}

/**
 * Fetch leaderboard data
 * TODO: Create backend endpoint for leaderboard
 */
export async function fetchLeaderboard() {
  return [...MOCK_LEADERBOARD];
}

/**
 * Save a completed study session
 * TODO: POST to session endpoint
 */
export async function saveSession(sessionData) {
  console.log('[Nami API] Session saved (mock):', sessionData);
  return { success: true, ...sessionData };
}

/**
 * Fetch tasks
 * TODO: Create backend endpoint for tasks
 */
export async function fetchTasks() {
  return [...MOCK_TASKS];
}

/**
 * Create a new task
 * TODO: POST to tasks endpoint
 */
export async function createTask(title) {
  const task = {
    id: `t-${Date.now()}`,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  console.log('[Nami API] Task created (mock):', task);
  return task;
}

/**
 * Update a task
 * TODO: PATCH to tasks endpoint
 */
export async function updateTask(taskId, updates) {
  console.log('[Nami API] Task updated (mock):', taskId, updates);
  return { id: taskId, ...updates };
}

/**
 * Delete a task
 * TODO: DELETE to tasks endpoint
 */
export async function deleteTask(taskId) {
  console.log('[Nami API] Task deleted (mock):', taskId);
  return { success: true };
}
