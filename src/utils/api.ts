import axios from "axios";

const API_URL = "http://localhost:3000"; // Backend URL

export const registerUserApi = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
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
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data; // Assuming response contains user data or token
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export interface CarPayload {
  brand: string;
  model: string;
  image: string;
  year: number;
  cost: number;
  description?: string;
}

export const listACarApi = async (payload: CarPayload) => {
  try {
    await axios.post(`${API_URL}/car/add`, payload);
  } catch (error: any) {
    const message = error.response?.data?.message;
    throw new Error(message);
  }
};

export const uploadImageApi = async (formData: FormData) => {
  const { data } = await axios.post(`${API_URL}/s3/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};
