import axios from "axios";
import { useAuthContext } from "../modules/auth/context/AuthProvider";

export default function useApi() {
  const authContext = useAuthContext();

  const api = axios.create({
    baseURL: "http://localhost:5173/api",
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    if (authContext.accessToken) {
      config.headers.Authorization = `Bearer ${authContext.accessToken}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        const res = await api.post("/auth/refresh");

        authContext.setAccessToken(res.data.accessToken);

        error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(error.config);
      }
      return Promise.reject(error);
    },
  );

  return api;
}
