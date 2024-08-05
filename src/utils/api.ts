import axios from "axios";

const API_URL = "http://localhost:3000/auth"; // Backend URL

export const registerUserApi = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    // Axios error handling
    const message = error.response?.data?.message || "Registration failed";
    throw new Error(message);
  }
};

export const loginUserApi = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Assuming response contains user data or token
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
