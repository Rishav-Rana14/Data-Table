
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; 

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiService = {
    getAllData: async (params = {}) => {
        try {
            const response = await api.get('/data', { params }); 
            return {
                data: response.data,
                totalCount: parseInt(response.headers['x-total-count'] || '0', 10),
            };
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },


    createData: async (newData) => {
        try {
            const response = await api.post('/data', newData); 
            return response.data;
        } catch (error) {
            console.error('Error creating data:', error);
            throw error;
        }
    },

    updateData: async (id, updatedData) => {
        try {
            const response = await api.put(`/data/${id}`, updatedData); 
            return response.data;
        } catch (error) {
            console.error(`Error updating data with id ${id}:`, error);
            throw error;
        }
    },

    deleteData: async (id) => {
        try {
            await api.delete(`/data/${id}`); 
        } catch (error) {
            console.error(`Error deleting data with id ${id}:`, error);
            throw error;
        }
    },

    getDataById: async (id) => {
        try {
            const response = await api.get(`/data/${id}`); 
            return response.data;
        } catch (error) {
            console.error(`Error getting data with id ${id}:`, error);
            throw error;
        }
    }
};

export default apiService;