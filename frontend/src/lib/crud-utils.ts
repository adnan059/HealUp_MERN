import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/logout");
    if (error.response?.status === 401 && !isAuthRoute) {
      dispatchEvent(new Event("force-logout"));
    }
    return Promise.reject(error);
  },
);

export const postData = async <T>(url: string, data?: unknown): Promise<T> => {
  const response = await api.post<T>(url, data);
  return response.data;
};

export const fetchData = async <T>(
  url: string,
  params?: unknown,
): Promise<T> => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

export const updateData = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await api.put<T>(url, data);
  return response.data;
};

export const deleteData = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);
  return response.data;
};
