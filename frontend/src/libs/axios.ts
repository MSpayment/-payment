/* eslint-disable no-underscore-dangle */
import _axios from "axios";

const axios = _axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post("/auth/refresh");

        return axios(originalRequest);
      } catch (err) {
        throw new Error("ログインしてください");
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
