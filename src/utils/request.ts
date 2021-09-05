import Axios, { AxiosError } from 'axios';
import 'dotenv/config';

export const HttpClient = Axios.create({
  baseURL: process.env.API_URL,
});

export const handleAxiosError = (error: AxiosError) => {
  switch (error.response?.status) {
    case 400:
      console.warn('Bad request, something is wrong with the request');
      break;
    case 404:
      console.warn('Resource not found, probably the id doesnt exists');
      break;
    case 503:
      console.warn('Resource unavailable, check the database connection');
      break;
    default:
      throw error;
  }
};
