import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data)
};

// Subjects API
export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`)
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getMyCourses: () => api.get('/courses/my-courses'),
  getMyCreatedCourses: () => api.get('/courses/my-created-courses'),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  // Section management
  addSection: (courseId, data) => api.post(`/courses/${courseId}/sections`, data),
  deleteSection: (courseId, sectionId) => api.delete(`/courses/${courseId}/sections/${sectionId}`),
  // Video management
  addVideo: (courseId, sectionId, data) => api.post(`/courses/${courseId}/sections/${sectionId}/videos`, data),
  updateVideo: (courseId, sectionId, videoId, data) => api.put(`/courses/${courseId}/sections/${sectionId}/videos/${videoId}`, data),
  deleteVideo: (courseId, sectionId, videoId) => api.delete(`/courses/${courseId}/sections/${sectionId}/videos/${videoId}`),
  // Video progress
  getVideoProgress: (courseId, sectionId, videoId) => api.get(`/courses/${courseId}/sections/${sectionId}/videos/${videoId}/progress`)
};

// Enrollments API
export const enrollmentsAPI = {
  enroll: (data) => api.post('/enrollments', data),
  getMyCourses: () => api.get('/enrollments/my-courses'),
  checkStatus: (subjectId) => api.get(`/enrollments/status/${subjectId}`)
};

// Video Progress API
export const videoProgressAPI = {
  updateProgress: (data) => api.post('/video-progress', data),
  getProgress: (videoId) => api.get(`/video-progress/${videoId}`),
  getCourseProgress: (courseId) => api.get(`/video-progress/course/${courseId}`)
};

export default api;
