import React from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function ThemedCards() {
    const [theme] = useLocalStorage("theme", "light");

    return (
        <div className={'card ${theme}'}>
            <h3>Themed Card</h3>
            <p>curr theme: {theme}</p>
        </div>
    )
}