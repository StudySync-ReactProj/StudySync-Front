import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
    ProgressWrapper,
    Subtitle,
    ProgressBar,
    ProgressFill,
    ProgressLabel,
    FooterText,
} from "./DailyProgress.style"

export default function DailyProgress({tasks = [], loading = false, error=null}){
    const [theme] = useLocalStorage("theme", "light");

    const total = tasks.length;
    const completed= tasks.filter((t) => t.completed).length;
    const percent=total === 0 ? 0 : Math.round((completed/total)*100);

    const [animatedPercent, setAnimatedPercent]=useState(0);

    useEffect(()=>{
        const id = setTimeout(() => setAnimatedPercent(percent), 50);
        return () => clearTimeout(id);
    },[percent]);

    if(loading) return <p>Loading daily progress...</p>;
    if(error) return <p style={{color:"red"}}>{error}</p>;

    return (
        <ProgressWrapper>
            <Subtitle themeMode={theme}>You're getting closer!</Subtitle>

            <ProgressBar themeMode={theme}>
                <ProgressFill percent={animatedPercent} themeMode={theme}>
                    <ProgressLabel themeMode={theme}>{percent}%</ProgressLabel>
                </ProgressFill>
            </ProgressBar>


            
            <FooterText themeMode={theme}>You're on 7-day streak!</FooterText>
        </ProgressWrapper>
);
}
