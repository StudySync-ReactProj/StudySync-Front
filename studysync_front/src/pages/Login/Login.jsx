// src/pages/Login/Login.jsx
import { useState } from "react";
import FormContainer from "../../components/FormContainer/FormContainer.jsx";
import TextFieldComp from "../../components/TextFieldComp/TextFieldComp.jsx";
import ButtonCont from "../../components/ButtonCont/ButtonCont.jsx";

// ⬇ ייבוא הסטיילים החדשים
import { LoginFormStack, FooterText, FooterLink } from "./Login.style.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleIChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", form);
  };

  return (
    <FormContainer title="StudySync" subtitle="Sign-in">
      <LoginFormStack spacing={3} component="form" onSubmit={handleSubmit}>
        <TextFieldComp
          inputLabel="Email"
          inputName="email"
          inputValue={form.email}
          handleIChange={handleIChange}
        />

        <TextFieldComp
          inputLabel="Password"
          inputName="password"
          inputValue={form.password}
          handleIChange={handleIChange}
        />

        <ButtonCont text="Login" onClick={handleSubmit} />
      </LoginFormStack>

      <FooterText>
        Don't have an account?
        <FooterLink component="span" onClick={() => console.log("Signup clicked")}>
          Signup Here
        </FooterLink>
      </FooterText>
    </FormContainer>
  );
}
