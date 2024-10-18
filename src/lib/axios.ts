import axios from "axios";

const URL = process.env.NEXT_PUBLIC_URL as string;

export const axiosInstance = axios.create({
  baseURL: URL + "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
