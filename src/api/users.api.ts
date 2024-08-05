// import axios from "axios";

// const API_URL = "http://localhost:3000/auth"; // Backend URL

// export const registerUser = async (
//   firstName: string,
//   lastName: string,
//   email: string,
//   password: string
// ) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, {
//       firstName,
//       lastName,
//       email,
//       password,
//     });
//     return response.data;
//   } catch (error: any) {
//     // Axios error handling
//     const message = error.response?.data?.message || "Registration failed";
//     throw new Error(message);
//   }
// };
