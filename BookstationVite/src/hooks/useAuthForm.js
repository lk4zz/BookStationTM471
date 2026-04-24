import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const useAuthForm = (apiFunction, initialData, redirectRoute) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFunction(formData);
      if (response?.token) {
        localStorage.setItem("token", response.token);

        const decodedUser = jwtDecode(response.token);

        if (decodedUser.roleId === 2) {
          navigate("/admin");
        } else {
          navigate(redirectRoute);
        }
      }
    } catch (err) {
      setError(
        err?.message ||
        "Authentication failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, error, isLoading, handleChange, handleSubmit };
};
