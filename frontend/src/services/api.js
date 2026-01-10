import axios from "axios";

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

client.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

client.interceptors.response.use(
  (res) => {
    console.log(`[API Response] ${res.config.url}`, res.status);
    return res;
  },
  (err) => {
    console.error("[API Response Error]", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    return Promise.reject(err);
  }
);

export default client;
