import axiosInstance from './axiosConfig';

export const skillsAPI = {
  // Get all skills (public)
  getAllSkills: async () => {
    try {
      const response = await axiosInstance.get('/skills');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search skills
  searchSkills: async (query) => {
    try {
      const response = await axiosInstance.get(`/skills/search?query=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get teach skills for current user
  getTeachSkills: async () => {
    try {
      const response = await axiosInstance.get('/skills/teach');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add teach skill
  addTeachSkill: async (skillData) => {
    try {
      const response = await axiosInstance.post('/skills/teach', skillData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove teach skill
  removeTeachSkill: async (skillId) => {
    try {
      const response = await axiosInstance.delete(`/skills/teach/${skillId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get learn skills for current user
  getLearnSkills: async () => {
    try {
      const response = await axiosInstance.get('/skills/learn');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add learn skill
  addLearnSkill: async (skillData) => {
    try {
      const response = await axiosInstance.post('/skills/learn', skillData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove learn skill
  removeLearnSkill: async (skillId) => {
    try {
      const response = await axiosInstance.delete(`/skills/learn/${skillId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get skills by category
  getSkillsByCategory: async (category) => {
    try {
      const response = await axiosInstance.get(`/skills/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};