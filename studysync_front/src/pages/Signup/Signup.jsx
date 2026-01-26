// src/pages/Signup/Signup.jsx

// ========== IMPORTS ==========
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice"; // אנחנו משתמשים באותו Reducer לעדכון המשתמש המחובר
import FormContainer from "../../components/FormContainer/FormContainer.jsx";
import TextFieldComp from "../../components/TextFieldComp/TextFieldComp.jsx";
import ButtonCont from "../../components/ButtonCont/ButtonCont.jsx";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig"; // הייבוא החשוב של ה-Axios

import { LoginFormStack, FooterText, FooterLink } from "./Signup.style.js";

// ========== MAIN SIGNUP COMPONENT ==========
export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleIChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = "Username is required";
        } else if (form.username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email must be a valid email address";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ========== SUBMIT HANDLER המעודכן ==========
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validate();
        if (!isValid) return;

        try {
            // 1. שליחת בקשה לרישום (Register)
            const { data } = await API.post("/users/register", {
                username: form.username,
                email: form.email,
                password: form.password,
            });

            console.log("Signup successful!", data);

            // 2. שמירת המידע ב-LocalStorage (השרת מחזיר טוקן גם בהרשמה)
            localStorage.setItem("userInfo", JSON.stringify(data));

            // 3. עדכון Redux כדי שהמשתמש ייכנס ישר למערכת
            dispatch(loginUser({
                username: data.username,
                email: data.email,
                token: data.token,
            }));

            alert("Welcome to StudySync!");
            navigate("/dashboard");

        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            alert(message);
        }
    };

    return (
        <FormContainer title="StudySync" subtitle="Sign-up">
            <LoginFormStack spacing={3} component="form" onSubmit={handleSubmit}>

                <TextFieldComp
                    inputLabel="Username"
                    inputName="username"
                    inputValue={form.username}
                    handleIChange={handleIChange}
                    error={!!errors.username}
                    helperText={errors.username}
                />

                <TextFieldComp
                    inputLabel="Email"
                    inputName="email"
                    inputValue={form.email}
                    handleIChange={handleIChange}
                    error={!!errors.email}
                    helperText={errors.email}
                />

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

                <ButtonCont text="Create Account" type="submit" />
            </LoginFormStack>

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