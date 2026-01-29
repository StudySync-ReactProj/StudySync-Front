import React, { useEffect, useState } from "react";
import {
    ProgressWrapper,
    Subtitle,
    ProgressBar,
    ProgressFill,
    ProgressLabel,
    FooterText,
} from "./DailyProgress.style"

export default function DailyProgress({ tasks = [], loading = false, error = null }) {

    
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const [animatedPercent, setAnimatedPercent] = useState(0);

    useEffect(() => {
        const id = setTimeout(() => setAnimatedPercent(percent), 50);
        return () => clearTimeout(id);
    }, [percent]);

    if (loading) return <p>Loading daily progress...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <ProgressWrapper>
            <Subtitle>You're getting closer!</Subtitle>

            <ProgressBar>
                <ProgressFill percent={animatedPercent}>
                    <ProgressLabel>{percent}%</ProgressLabel>
                </ProgressFill>
            </ProgressBar>
        </ProgressWrapper>
    );
}
