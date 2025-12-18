// src/pages/Login/Login.jsx

// ========== IMPORTS ==========
import { useState } from "react";
import { useUser } from "../../Contex/UserContex";
import FormContainer from "../../components/FormContainer/FormContainer.jsx";
import TextFieldComp from "../../components/TextFieldComp/TextFieldComp.jsx";
import ButtonCont from "../../components/ButtonCont/ButtonCont.jsx";
import { useNavigate } from "react-router-dom";


import { LoginFormStack, FooterText, FooterLink } from "./Login.style.js";

// ========== MAIN LOGIN COMPONENT ==========
export default function Login() {
  // ========== Route ==========
  const navigate = useNavigate();


  // ========== USER CONTEXT ==========
  const { login } = useUser();

  // ========== FORM & ERROR STATE ==========
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({}); // Stores validation errors for each field

  // ========== INPUT CHANGE HANDLER ==========
  const handleIChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value, // Update only the changed field
    }));
  };

  // ========== VALIDATION FUNCTION ==========
  const validate = () => {
    const newErrors = {};

    // Username validation
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

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
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // ========== SUBMIT HANDLER ==========
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) return; // Stop if validation failed

    // If validation passed:
    console.log("Login data:", form);

    // Save user data to context
    login({
      username: form.username,
      email: form.email,
    });

    console.log("Login successful! Navigating to HomePage...");
    navigate("/"); // 
  };

  // ========== RENDER ==========
  return (
    <FormContainer title="StudySync" subtitle="Sign-in">
      <LoginFormStack spacing={3} component="form" onSubmit={handleSubmit}>

        {/* Username Field */}
        <TextFieldComp
          inputLabel="Username"
          inputName="username"
          inputValue={form.username}
          handleIChange={handleIChange}
          error={!!errors.username}
          helperText={errors.username}
        />

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
          onClick={() => alert("Signup functionality coming soon!")}
        >
          Signup Here
        </FooterLink>
      </FooterText>
    </FormContainer>
  );
}
