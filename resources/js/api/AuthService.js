import API from "./apiClient";

// 🧩 Մուտք (Login)
export const login = async (credentials) => {
  // credentials-ը օբյեկտ է, օրինակ՝ { email, password }
  return API.post("/login", credentials);
};

// 🧩 Գրանցում (Register)
export const register = async (userData) => {
  // userData՝ { name, email, password, password_confirmation }
  return API.post("/register", userData);
};

// 🧩 Ելք (Logout)
export const logout = async () => {
  await API.post("/logout");          // ուղարկում է backend
  localStorage.removeItem("authToken"); // ջնջում է frontend token-ը
};

// 🧩 Հասնել ընթացիկ օգտատիրոջ տվյալներին (Authenticated user info)
export const getCurrentUser = async () => {
  return API.get("/user");
};
