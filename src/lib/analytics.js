'use client';

// Mock analytics system
class Analytics {
  constructor() {
    this.events = [];
    this.isInitialized = false;
    this.userId = null;
  }

  // Initialize analytics
  init() {
    if (this.isInitialized) {
      return;
    }
    
    // Load stored events from localStorage
    if (typeof window !== 'undefined') {
      const storedEvents = localStorage.getItem('analytics_events');
      if (storedEvents) {
        try {
          this.events = JSON.parse(storedEvents);
        } catch (error) {
          console.error('Error parsing stored analytics events:', error);
          this.events = [];
        }
      }
    }
    
    this.isInitialized = true;
    console.log('Analytics initialized');
  }

  // Set user ID for tracking
  setUser(userId) {
    this.userId = userId;
    console.log(`Analytics user set: ${userId}`);
  }

  // Track an event
  trackEvent(eventName, eventData = {}) {
    if (!this.isInitialized) {
      this.init();
    }

    const event = {
      eventName,
      eventData,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      path: typeof window !== 'undefined' ? window.location.pathname : '',
    };

    this.events.push(event);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      // Keep only the most recent 100 events to avoid localStorage size limits
      const recentEvents = this.events.slice(-100);
      localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
    }
    
    console.log(`Analytics event tracked: ${eventName}`, eventData);
    
    return event;
  }

  // Track page view
  trackPageView(path) {
    return this.trackEvent('page_view', { path });
  }

  // Track user interaction
  trackInteraction(interactionType, elementId, additionalData = {}) {
    return this.trackEvent('interaction', {
      type: interactionType,
      elementId,
      ...additionalData
    });
  }

  // Track lesson progress
  trackLessonProgress(lessonId, progress, additionalData = {}) {
    return this.trackEvent('lesson_progress', {
      lessonId,
      progress,
      ...additionalData
    });
  }

  // Get analytics data for reporting
  getAnalyticsData() {
    return {
      events: this.events,
      summary: this.generateSummary()
    };
  }

  // Generate a summary of analytics data
  generateSummary() {
    const pageViews = this.events.filter(event => event.eventName === 'page_view');
    const lessonProgress = this.events.filter(event => event.eventName === 'lesson_progress');
    const interactions = this.events.filter(event => event.eventName === 'interaction');
    
    const pageViewCount = {};
    pageViews.forEach(event => {
      const path = event.eventData.path;
      pageViewCount[path] = (pageViewCount[path] || 0) + 1;
    });
    
    return {
      totalEvents: this.events.length,
      pageViews: {
        total: pageViews.length,
        byPage: pageViewCount
      },
      lessonProgress: {
        total: lessonProgress.length,
        uniqueLessons: [...new Set(lessonProgress.map(event => event.eventData.lessonId))].length
      },
      interactions: {
        total: interactions.length,
        byType: this.countByProperty(interactions, 'type')
      },
      timeframe: {
        start: this.events.length > 0 ? this.events[0].timestamp : null,
        end: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : null
      }
    };
  }

  // Helper method to count events by a property
  countByProperty(events, property) {
    const counts = {};
    events.forEach(event => {
      const value = event.eventData[property];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return counts;
  }

  // Get or create a session ID
  getSessionId() {
    if (typeof window === 'undefined') {
      return 'server-side';
    }
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    
    return sessionId;
  }

  // Clear analytics data (for testing)
  clearAnalytics() {
    this.events = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_events');
    }
    console.log('Analytics data cleared');
  }
}

// Create singleton instance
const analytics = new Analytics();

// Export methods for use in application
export const initAnalytics = () => analytics.init();
export const setAnalyticsUser = (userId) => analytics.setUser(userId);
export const trackEvent = (eventName, eventData) => analytics.trackEvent(eventName, eventData);
export const trackPageView = (path) => analytics.trackPageView(path);
export const trackInteraction = (interactionType, elementId, additionalData) => 
  analytics.trackInteraction(interactionType, elementId, additionalData);
export const trackLessonProgress = (lessonId, progress, additionalData) => 
  analytics.trackLessonProgress(lessonId, progress, additionalData);
export const getAnalyticsData = () => analytics.getAnalyticsData();
export const clearAnalytics = () => analytics.clearAnalytics(); 