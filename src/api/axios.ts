import axios from "axios";

// Create a centralized Axios instance
const api = axios.create({
  baseURL: "http://localhost:5001/api", // Added /api to match your backend endpoints structure cleanly
  withCredentials: true, // Sends HttpOnly cookies (refreshToken) automatically
});

// Request Interceptor: Automatically stamps the access token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized automatic token refresh trapdoor
api.interceptors.response.use(
  (response) => response, // If 200/2xx, let the data flow cleanly
  async (error) => {
    const originalRequest = error.config;

    // Catch 401 Unauthorized errors and verify we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Flag to prevent infinite loops

      try {
        console.log("Access token expired. Requesting silent refresh...");

        // Fire request to your refresh route. Browser includes the cookie automatically!
        const refreshResponse = await axios.post(
          "http://localhost:5001/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const { accessToken: newAccessToken } = refreshResponse.data;

        // Save the brand new token
        localStorage.setItem("accessToken", newAccessToken);

        // Update the original failed request's header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("Token refreshed successfully! Retrying original operation...");
        // Re-execute and return the original request seamlessly
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid. Clearing session.");
        
        // Session completely dead — wipe storage clean
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        // CHANGED: Removed the window.location.href hard-reload to break the endless cycle.
        // Your App.tsx ProtectedRoute component will automatically see that accessToken is gone
        // and route the user cleanly back to /login via React Router.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;