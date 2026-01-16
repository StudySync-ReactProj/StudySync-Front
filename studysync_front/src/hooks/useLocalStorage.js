import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
    // read value fron loacal storage once at the beginning
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            // if there is a stored value, parse and return it, otherwise return the initial value
            return stored !== null ? JSON.parse(stored) : initialValue;
        }
        // if error, return initial value
        catch {
            return initialValue;
        }
    });

    // update value in local storage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // ignore write errors
        }
    }, [key, value]);
    return [value, setValue];

};