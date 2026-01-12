import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api";

console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 500000, // 8 min timeout
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);

    // Enhance error message for better UX
    const errorMessage = error.response?.data?.detail
      || error.response?.data?.message
      || error.message
      || 'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// API Methods
export const ctganAPI = {
  // Upload CSV dataset
  uploadDataset: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Train CTGAN model
  trainModel: async () => {
    const response = await apiClient.post('/train');
    return response.data;
  },

  // Get training status
  getTrainingStatus: async () => {
    const response = await apiClient.get('/train/status');
    return response.data;
  },


  // Generate synthetic data
  generateData: async (numRows) => {
    const response = await apiClient.post('/generate', { num_rows: numRows });
    return response.data;
  },

  // Get utility evaluation metrics
  getEvaluationMetrics: async () => {
    const response = await apiClient.get('/evaluate');
    return response.data;
  },

  // Get privacy metrics
    getPrivacyMetrics: async () => {
      const response = await apiClient.get('/evaluate');
      return response.data;
  },

  // Download synthetic CSV
  downloadSyntheticData: async () => {
    const response = await apiClient.get('/download/synthetic', {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'synthetic_data.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Download started' };
  },
};

export default apiClient;
