import axiosInstance from './axiosConfig';

export const matchesAPI = {
  // Get matches for current user
  getMatches: async () => {
    try {
      const response = await axiosInstance.get('/matches');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get users by skill
  getUsersBySkill: async (skillId) => {
    try {
      const response = await axiosInstance.get(`/matches/skill/${skillId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};