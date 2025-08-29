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
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get V Products
export const getVproducts = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/view_vendor_products/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get Products
export const getProducts = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/view_products/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get New Arrivals
export const getNewArrivals = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/view_new_arrivals/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get hot Items
export const getItems = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/view_items/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get Limited Items
export const getLimited = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/view_limited/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Update Profile
export const updateProfile = async (
  id: number,
  username: string,
  email: string,
  password: string
) => {
  return axios.put(`${API_URL}/update/`, { id, username, email, password });
};

//Get user role
export const get_user_role = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/get_user_role`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Vendor Form Fillup
export const vendorForm = async (
  vendor_id: number,
  store_name: string,
  store_type: string
) => {
  return axios.post(`${API_URL}/vendor_form/`, {
    vendor_id,
    store_name,
    store_type,
  });
};

//Add Product
export const addProduct = async (
  uid: number,
  product_name: string,
  product_type: string,
  price: number,
  quantity: number,
  image: string,
  brand: string
) => {
  return axios.post(`${API_URL}/add_product/`, {
    uid,
    product_name,
    product_type,
    price,
    quantity,
    image,
    brand,
  });
};

//Add To Cart
export const addToCart = async (
  user_id: number,
  product_id: number,
  product_name: string,
  price: number,
  image: string,
  store_name: string,
  quantity: number
) => {
  return axios.post(`${API_URL}/add_to_cart/`, {
    user_id,
    product_id,
    product_name,
    price,
    image,
    store_name,
    quantity,
  });
};

//Get Cart Details
export const getCartDetails = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/get_cart_details/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get Current Orders
export const getCurrentOrders = () => {
  const token = localStorage.getItem("access_token");
  return axios.get(`${API_URL}/get_current_orders/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Remove Items from Cart
export const removeItems = (product_id: number) => {
  const token = localStorage.getItem("access_token");
  return axios.delete(`${API_URL}/remove_from_cart/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { product_id },
  });
};

export const initiatePay = async (paymentData: {
  amount: number;
  product_name: string;
}) => {
  const token = localStorage.getItem("access_token");
  return axios.post(`${API_URL}/initiate_payment/`, paymentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const saveTransaction = async (transactionData: {
  transaction_id: string;
  amount: number;
}) => {
  const token = localStorage.getItem("access_token");
  return axios.post(`${API_URL}/save_transaction/`, transactionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//add orders
export const addOrders = async (
  user_id: number,
  product_id: number,
  transaction_id: string,
  amount: number,
  phone: string,
  address: string,
  city: string,
  postalCode: string
) => {
  return axios.post(`${API_URL}/add_orders/`, {
    user_id,
    product_id,
    transaction_id,
    amount,
    phone,
    address,
    city,
    postalCode,
  });
};

//search products
export const searchProducts = (query: string) => {
  const token = localStorage.getItem("access_token");
  return axios.get(
    `${API_URL}/search_products/?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
