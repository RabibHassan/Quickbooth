import axios from "axios";

//set up base URL for django api
const API_URL = "http://127.0.0.1:8000/api/auth";

//Register user
export const register = async (
  username: string,
  email: string,
  password: string
) => {
  return axios.post(`${API_URL}/register/`, { username, email, password });
};

//Login user and get JWT tokens
export const login = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login/`, { email, password });
};

//Logout func(clear JWT tokens)

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

//View profile

export const getProfile = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/view_profile/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateProfile = async (
  id: string,
  username: string,
  email: string,
  password: string
) => {
  return axios.put(`${API_URL}/update/`, { id, username, email, password })
}

export const vendorForm = async (
  store_name: string
) => {
  return axios.post(`${API_URL}/vendor_form/`, { store_name })
}
