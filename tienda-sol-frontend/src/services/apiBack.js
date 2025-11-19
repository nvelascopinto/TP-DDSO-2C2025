import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;
export const apiBack = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});