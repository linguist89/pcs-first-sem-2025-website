// Data fetching utilities with SWR integration

// Helper function to fetch data from JSON files
export async function fetchData(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${path}:`, error);
    throw error;
  }
}

// Fetch user progress
export async function fetchUserProgress(userId) {
  const progress = await fetchData('/data/user-progress.json');
  return progress.users.find(user => user.id === userId) || null;
}

// Fetch announcements
export async function fetchAnnouncements() {
  return fetchData('/data/announcements.json');
}

// Fetch upcoming classes
export async function fetchUpcomingClasses() {
  return fetchData('/data/upcoming-classes.json');
}

// SWR fetcher function for use with useSWR hook
export const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Function to preload data for critical paths
export async function preloadCriticalData() {
  try {
    // Fetch multiple resources in parallel
    await Promise.all([
      fetchAnnouncements(),
      fetchUpcomingClasses()
    ]);
    
    console.log('Critical data preloaded successfully');
  } catch (error) {
    console.error('Error preloading critical data:', error);
  }
} 