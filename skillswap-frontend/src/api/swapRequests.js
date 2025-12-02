import axiosInstance from './axiosConfig';

export const swapRequestsAPI = {
  // Create swap request
  createRequest: async (requestData) => {
    try {
      const response = await axiosInstance.post('/swap-requests', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get sent requests
  getSentRequests: async () => {
    try {
      const response = await axiosInstance.get('/swap-requests/sent');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get received requests
  getReceivedRequests: async () => {
    try {
      const response = await axiosInstance.get('/swap-requests/received');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Accept request
  acceptRequest: async (requestId) => {
    try {
      const response = await axiosInstance.put(`/swap-requests/${requestId}/accept`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reject request
  rejectRequest: async (requestId) => {
    try {
      const response = await axiosInstance.put(`/swap-requests/${requestId}/reject`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel request
  cancelRequest: async (requestId) => {
    try {
      const response = await axiosInstance.put(`/swap-requests/${requestId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get request by ID
  getRequestById: async (requestId) => {
    try {
      const response = await axiosInstance.get(`/swap-requests/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};