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
  createSessionFromRequest: (requestId) => 
    api.post(`/sessions/create-from-request/${requestId}`),
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
  },

  // Complete session
  completeSession: async (sessionId) => {
    try {
      const response = await axiosInstance.put(`/sessions/${sessionId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Rate session
  rateSession: async (sessionId, rating, feedback) => {
    try {
      const response = await axiosInstance.post(`/sessions/${sessionId}/rate`, {
        rating,
        feedback
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// import axiosInstance from './axiosConfig';

// export const sessionsAPI = {
//   // Get sessions for current user
//   getSessions: async () => {
//     try {
//       const response = await axiosInstance.get('/api/sessions');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get categorized sessions (created, upcoming, inProgress, completed)
//   getCategorizedSessions: async () => {
//     try {
//       const response = await axiosInstance.get('/api/sessions/categorized');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get session by ID
//   getSessionById: async (sessionId) => {
//     try {
//       const response = await axiosInstance.get(`/api/sessions/${sessionId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Create session from swap request
//   createSessionFromRequest: async (requestId) => {
//     try {
//       const response = await axiosInstance.post(`/api/sessions/create-from-request/${requestId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get session details with meeting info
//   getSessionDetails: async (sessionId) => {
//     try {
//       const response = await axiosInstance.get(`/api/sessions/${sessionId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get meeting details (URL, platform, partner info)
//   getMeetingDetails: async (sessionId) => {
//     try {
//       const response = await axiosInstance.get(`/api/sessions/${sessionId}/meeting-details`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get meeting link
//   getMeetingLink: async (sessionId) => {
//     try {
//       const response = await axiosInstance.get(`/api/sessions/${sessionId}/meeting-link`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Schedule session
//   scheduleSession: async (sessionId, scheduledDate, duration) => {
//     try {
//       const response = await axiosInstance.put(`/api/sessions/${sessionId}/schedule`, null, {
//         params: { scheduledDate, duration }
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Start session
//   startSession: async (sessionId) => {
//     try {
//       const response = await axiosInstance.put(`/api/sessions/${sessionId}/start`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Simple mark as completed (single user confirmation)
//   markSessionAsCompleted: async (sessionId) => {
//     try {
//       const response = await axiosInstance.put(`/api/sessions/${sessionId}/mark-completed`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Complete session (dual confirmation - original method)
//   completeSession: async (sessionId) => {
//     try {
//       const response = await axiosInstance.put(`/api/sessions/${sessionId}/complete`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Add meeting URL
//   addMeetingUrl: async (sessionId, meetingUrl, meetingPlatform) => {
//     try {
//       const response = await axiosInstance.put(`/api/sessions/${sessionId}/meeting-url`, null, {
//         params: { meetingUrl, meetingPlatform }
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Update session notes
//   updateSessionNotes: async (sessionId, notes) => {
//     try {
//       const response = await axiosInstance.put(`/api/sessions/${sessionId}/notes`, null, {
//         params: { notes }
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Add shared resources
//   addSharedResources: async (sessionId, resources) => {
//     try {
//       const response = await axiosInstance.put(`/api/sessions/${sessionId}/resources`, null, {
//         params: { resources }
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Cancel session
//   cancelSession: async (sessionId) => {
//     try {
//       const response = await axiosInstance.put(`/api/sessions/${sessionId}/cancel`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Rate session (for progress tracking)
//   rateSession: async (sessionId, rating, feedback) => {
//     try {
//       const response = await axiosInstance.post(`/api/sessions/${sessionId}/rate`, {
//         rating,
//         feedback
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Get session progress tracking
//   getSessionProgress: async (sessionId) => {
//     try {
//       const response = await axiosInstance.get(`/api/sessions/${sessionId}/progress`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   }
// };