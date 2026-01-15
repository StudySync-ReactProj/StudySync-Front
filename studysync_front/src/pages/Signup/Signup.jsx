// src/pages/Login/Login.jsx

// ========== IMPORTS ==========
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice";
import FormContainer from "../../components/FormContainer/FormContainer.jsx";
import TextFieldComp from "../../components/TextFieldComp/TextFieldComp.jsx";
import ButtonCont from "../../components/ButtonCont/ButtonCont.jsx";
import { useNavigate } from "react-router-dom";


import { LoginFormStack, FooterText, FooterLink } from "./Signup.style.js";

// ========== MAIN SIGNUP COMPONENT ==========
export default function Signup() {
    // ========== Route ==========
    const navigate = useNavigate();


    // ========== REDUX ==========
    const dispatch = useDispatch();

    // ========== FORM & ERROR STATE ==========
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        // Confirm Password validation
        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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

        // Save user data to Redux store
        dispatch(loginUser({
            username: form.username,
            email: form.email,
        }));

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

                <TextFieldComp
                    inputLabel="Confirm Password"
                    inputName="confirmPassword"
                    inputValue={form.confirmPassword}
                    handleIChange={handleIChange}
                    type="password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                />

                {/* Submit Button */}
                <ButtonCont text="Login" type="submit" />
            </LoginFormStack>

            {/* Footer (Signup link) */}
            <FooterText>
                Already have an account?
                <FooterLink
                    component="span"
                    onClick={() => navigate("/login")}
                >
                    Login Here
                </FooterLink>
            </FooterText>
        </FormContainer>
    );
}
