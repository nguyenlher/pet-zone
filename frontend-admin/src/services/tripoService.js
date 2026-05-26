// src/services/tripoService.js
import axios from 'axios';

const TRIPO_API_KEY = import.meta.env.VITE_TRIPO_API_KEY || '';
// Use the Vite dev proxy (/tripo-api → https://api.tripo3d.ai/v2/openapi)
// so requests are forwarded server-side and never trigger CORS preflight.
const TRIPO_BASE_URL = '/tripo-api';

// Cheapest available model version for image_to_model
export const DEFAULT_MODEL_VERSION = 'v2.0-20240919';

// Create axios instance for Tripo API
const tripoApi = axios.create({
  baseURL: TRIPO_BASE_URL,
});

// Always inject API key
tripoApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${TRIPO_API_KEY}`;
  return config;
});

/**
 * Step 1 – Upload image file, returns a file_token.
 * @param {File} file
 * @returns {Promise<string>} file_token
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await tripoApi.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // response: { code: 200, data: { image_token: "..." } }
  const token = data?.data?.image_token;
  if (!token) throw new Error('Upload failed: no file_token returned');
  return token;
};

/**
 * Step 2 – Create an image_to_model task using the file_token.
 * @param {string} fileToken - token from uploadFile()
 * @param {string} [modelVersion] - model version string (default: cheapest v2.0-20240919)
 * @returns {Promise<string>} task_id
 */
export const createImageTo3DTask = async (fileToken, modelVersion = DEFAULT_MODEL_VERSION) => {
  // Detect file type from token prefix (heuristic); use 'jpg' as safe default
  const fileType = 'jpg';

  const payload = {
    type: 'image_to_model',
    model_version: modelVersion,
    file: {
      type: fileType,
      file_token: fileToken,
    },
  };

  const { data } = await tripoApi.post('/task', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // response: { code: 200, data: { task_id: "..." } }
  const taskId = data?.data?.task_id;
  if (!taskId) throw new Error('Task creation failed: no task_id returned');
  return taskId;
};

/**
 * Step 3 – Get the current status of a task.
 * @param {string} taskId
 * @returns {Promise<Object>} full task object
 */
export const getTaskStatus = async (taskId) => {
  const { data } = await tripoApi.get(`/task/${taskId}`);
  // response: { code: 200, data: { task_id, type, status, progress, output: { model: { type, url } }, ... } }
  return data?.data;
};

/**
 * Get all tasks for the current API key (max 100, latest first).
 * @returns {Promise<Array>}
 */
export const getTaskList = async () => {
  const { data } = await tripoApi.get('/task', {
    params: { limit: 20 },
  });
  return data?.data?.list || [];
};

/**
 * Cancel a running task.
 * @param {string} taskId
 */
export const cancelTask = async (taskId) => {
  const { data } = await tripoApi.post(`/task/${taskId}/cancel`);
  return data;
};

/**
 * Download GLB file from Tripo URL and upload to Cloudinary.
 * @param {string} glbUrl - URL of the GLB file from Tripo
 * @param {string} petId - Pet ID for naming
 * @returns {Promise<string>} Cloudinary URL
 */
export const downloadAndUploadToCloudinary = async (glbUrl, petId) => {
  try {
    // Step 1: Download GLB file from Tripo
    const response = await fetch(glbUrl);
    if (!response.ok) {
      throw new Error('Failed to download GLB file from Tripo');
    }
    
    const blob = await response.blob();
    const file = new File([blob], `pet_${petId}_3d_model.glb`, { type: 'model/gltf-binary' });
    
    // Step 2: Upload to Cloudinary via pet-service
    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicId', `pet_${petId}`);
    
    const uploadResponse = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090'}/api/media/upload-model`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return uploadResponse.data.url;
  } catch (error) {
    console.error('Error downloading and uploading GLB:', error);
    throw error;
  }
};

export default {
  uploadFile,
  createImageTo3DTask,
  getTaskStatus,
  getTaskList,
  cancelTask,
  downloadAndUploadToCloudinary,
};
