// src/api/jobService.js
// Simple API wrapper for fetching job data from backend
// Adjust the base URL if your backend runs on a different host/port.

export const searchJobs = async (filters = {}) => {
  const { skills = '', experience = '', location = '' } = filters;
  const query = new URLSearchParams({
    skills,
    experience,
    location,
  }).toString();
  
  const baseURL = import.meta.env.VITE_API_URL || '/api';
  const response = await fetch(`${baseURL}/jobs?${query}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch jobs: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data?.data || data || []; // Expect an array of job objects
};
