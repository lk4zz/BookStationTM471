import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const useAuthForm = (apiFunction, initialData, redirectRoute) => {
  const navigate = useNavigate();
  //form loading and error states
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //handle state change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  //submit form (log in or signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    //set token and determine if admin or normal user
    try {
      const response = await apiFunction(formData);
      if (response?.token) {
        localStorage.setItem("token", response.token);

        const decodedUser = jwtDecode(response.token);

        const adminRoleIds = [3, 4];
        if (adminRoleIds.includes(decodedUser.roleId)) {
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
      //exit loading state when authentication is done
      setIsLoading(false);
    }
  };

  return { formData, error, isLoading, handleChange, handleSubmit };
};
