// src/pages/Login/Login.jsx

// ========== IMPORTS ==========
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice";
import FormContainer from "../../components/FormContainer/FormContainer.jsx";
import TextFieldComp from "../../components/TextFieldComp/TextFieldComp.jsx";
import ButtonCont from "../../components/ButtonCont/ButtonCont.jsx";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";

import { LoginFormStack, FooterText, FooterLink } from "./Login.style.js";

// ========== MAIN LOGIN COMPONENT ==========
export default function Login() {
  // ========== Route ==========
  const navigate = useNavigate();

  // ========== REDUX ==========
  const dispatch = useDispatch();

  // ========== FORM & ERROR STATE ==========
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); // Stores validation errors

  // ========== INPUT CHANGE HANDLER ==========
  const handleIChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========== VALIDATION FUNCTION ==========
  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email must be a valid email address";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========== SUBMIT HANDLER ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    try {
      // 1. Send request to server (Email & Password only)
      const { data } = await API.post("/users/login", {
        email: form.email,
        password: form.password,
      });

      console.log("Login successful! Data from server:", data);

      // 2. Save user info and token in LocalStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // 3. Update Redux with the data returned from server (including username and token)
      dispatch(loginUser({
        username: data.username,
        email: data.email,
        token: data.token 
      }));

      // 4. Navigation
      navigate("/dashboard");

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setErrors((prev) => ({ ...prev, general: message }));
      alert(message);
    }
  };

  // ========== RENDER ==========
  return (
    <FormContainer title="StudySync" subtitle="Sign-in">
      <LoginFormStack spacing={3} component="form" onSubmit={handleSubmit}>

        {/* Email Field */}
        <TextFieldComp
          inputLabel="Email"
          inputName="email"
          inputValue={form.email}
          handleIChange={handleIChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Password Field */}
        <TextFieldComp
          inputLabel="Password"
          inputName="password"
          inputValue={form.password}
          handleIChange={handleIChange}
          type="password"
          error={!!errors.password}
          helperText={errors.password}
        />

        {/* Submit Button */}
        <ButtonCont text="Login" type="submit" />
      </LoginFormStack>

      {/* Footer (Signup link) */}
      <FooterText>
        Don't have an account?
        <FooterLink
          component="span"
          onClick={() => navigate("/signup")}
        >
          Signup Here
        </FooterLink>
      </FooterText>
    </FormContainer>
  );
}