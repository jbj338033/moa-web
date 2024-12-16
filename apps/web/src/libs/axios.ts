import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useTokenStore } from "../stores/token";

const REFRESH_URL = "/auth/reissue";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ErrorResponse {
  code: string;
  message: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach((cb) => cb(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

export const moaAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

moaAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useTokenStore.getState();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

moaAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const { refreshToken, setAccessToken, setRefreshToken, clearTokens } =
      useTokenStore.getState();
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest || !error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 액세스 토큰이 만료된 경우 (401 에러)
    if (error.response.status === 401 && refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const response = await axios.post<RefreshResponse>(
            `${API_URL}${REFRESH_URL}`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          setAccessToken(newAccessToken);
          setRefreshToken(newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          onRefreshed(newAccessToken);
          isRefreshing = false;

          return moaAxios(originalRequest);
        } catch (refreshError) {
          clearTokens();

          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(moaAxios(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);
