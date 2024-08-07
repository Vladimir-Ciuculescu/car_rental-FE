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
  userId: number;
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

export const getAvailableCarsApi = async (payload: {
  brand: string;
  model: string;
}) => {
  try {
    const { data } = await axios.get(`${API_URL}/car/get-available-cars`, {
      params: payload,
    });
    return data;
  } catch (error: any) {
    const message = error.response?.data?.message;

    throw new Error(message);
  }
};

export const getCarDetailsApi = async (carId: number) => {
  try {
    const { data } = await axios.get(`${API_URL}/car/car-details/${carId}`);
    return data;
  } catch (error: any) {
    const message = error.response?.data?.message;

    throw new Error(message);
  }
};

export interface RequestPayload {
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  carId: number;
  userId: number;
}

export const addCarRequestApi = async (data: RequestPayload) => {
  try {
    await axios.post(`${API_URL}/request/add-car-request`, data);
  } catch (error: any) {
    const message = error.response?.data?.message;

    throw new Error(message);
  }
};

export const getRequestsForYourCarsApi = async (userId: number) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/request/requests-your-cars/${userId}`
    );
    return data;
  } catch (error: any) {
    const message = error.response?.data?.message;

    throw new Error(message);
  }
};

export const declineRequestApi = async (requestId: number) => {
  try {
    await axios.post(`${API_URL}/request/decline-request/${requestId}`);
  } catch (error: any) {
    const message = error.response?.data?.message;

    throw new Error(message);
  }
};

export interface AcceptRequestPayload {
  carId: number;
  requestId: Number;
}

export const acceptRequestApi = async (body: AcceptRequestPayload) => {
  try {
    await axios.post(`${API_URL}/request/accept-request`, body);
  } catch (error: any) {
    const message = error.response?.data?.message;

    throw new Error(message);
  }
};
