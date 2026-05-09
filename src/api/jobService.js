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
  const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/jobs?${query}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch jobs: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data; // Expect an array of job objects
};
