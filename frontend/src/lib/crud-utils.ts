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

export const postData = async <TResponse, TRequest = unknown>(
  url: string,
  data?: TRequest,
): Promise<TResponse> => {
  const response = await api.post<TResponse>(url, data);
  return response.data;
};

export const fetchData = async <T, P = unknown>(
  url: string,
  params?: P,
): Promise<T> => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

export const updateData = async <TResponse, TRequest = unknown>(
  url: string,
  data: TRequest,
): Promise<TResponse> => {
  const response = await api.put<TResponse>(url, data);
  return response.data;
};

export const deleteData = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);
  return response.data;
};
