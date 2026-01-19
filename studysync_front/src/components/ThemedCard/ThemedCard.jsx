import React from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { CardWrapper } from "./ThemedCard.style";

export default function ThemedCard() {
    const [theme] = useLocalStorage("theme", "light");

    return (
        <CardWrapper themeMode={theme}>
            <h3>Themed Card</h3>
            <p>curr theme: {theme}</p>
        </CardWrapper>
    );
}
