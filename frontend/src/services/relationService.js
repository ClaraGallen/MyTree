// relationService.js
import axios from 'axios';

const relationService = {
  createRelation: async (relationData) => {
    try {
      const response = await axios.post('/tree/relation', relationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Autres fonctions pour gérer les opérations CRUD sur les relations
};

export default relationService;
