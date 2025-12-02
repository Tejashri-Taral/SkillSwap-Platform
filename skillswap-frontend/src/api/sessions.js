import axiosInstance from './axiosConfig';

export const sessionsAPI = {
  // Get sessions for current user
  getSessions: async () => {
    try {
      const response = await axiosInstance.get('/sessions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get session by ID
  getSessionById: async (sessionId) => {
    try {
      const response = await axiosInstance.get(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Schedule session
  scheduleSession: async (sessionId, scheduledDate, duration) => {
    try {
      const response = await axiosInstance.put(`/sessions/${sessionId}/schedule`, null, {
        params: { scheduledDate, duration }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Start session
  startSession: async (sessionId) => {
    try {
      const response = await axiosInstance.put(`/sessions/${sessionId}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add meeting URL
  addMeetingUrl: async (sessionId, meetingUrl, meetingPlatform) => {
    try {
      const response = await axiosInstance.put(`/sessions/${sessionId}/meeting-url`, null, {
        params: { meetingUrl, meetingPlatform }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update session notes
  updateSessionNotes: async (sessionId, notes) => {
    try {
      const response = await axiosInstance.put(`/sessions/${sessionId}/notes`, null, {
        params: { notes }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add shared resources
  addSharedResources: async (sessionId, resources) => {
    try {
      const response = await axiosInstance.put(`/sessions/${sessionId}/resources`, null, {
        params: { resources }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};