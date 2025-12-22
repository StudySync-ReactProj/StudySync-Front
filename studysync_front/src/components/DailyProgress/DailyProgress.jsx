import React from "react";
import {
    ProgressWrapper,
    Subtitle,
    ProgressBar,
    ProgressFill,
    ProgressLabel,
    FooterText,
} from "./DailyProgress.style"

export default function DailyProgress({tasks = [], loading = false, error=null}){
    if(loading) return <p>Loading daily progress...</p>;
    if(error) return <p style={{color:"red"}}>{error}</p>;

    const total = tasks.length;
    const completed= tasks.filter((t) => t.completed).length;

    const percent=total === 0 ? 0 : Math.round((completed/total)*100);

    return (
        <ProgressWrapper>
            <Subtitle>You're getting closer!</Subtitle>

            <ProgressBar>
                <ProgressFill percent={percent} />
                <ProgressLabel percent={percent}>{percent}%</ProgressLabel>
            </ProgressBar>
            
            <FooterText>You're on 7-day streak!</FooterText>
        </ProgressWrapper>
);
}
