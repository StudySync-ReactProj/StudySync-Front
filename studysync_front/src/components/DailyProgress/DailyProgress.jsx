// DailyProgress.jsx
import React, { useEffect, useState } from "react";
import {
    ProgressWrapper,
    Subtitle,
    ProgressBar,
    ProgressFill,
    ProgressLabel,
} from "./DailyProgress.style";

export default function DailyProgress({ percent = 0 }) {
    const safe = Math.max(0, Math.min(100, Number(percent) || 0));

    // Simple animation
    const [animatedPercent, setAnimatedPercent] = useState(0);

    useEffect(() => {
        const id = setTimeout(() => setAnimatedPercent(safe), 50);
        return () => clearTimeout(id);
    }, [safe]);

    return (
        <ProgressWrapper>
            <Subtitle>You're getting closer!</Subtitle>

            <ProgressBar>
                <ProgressFill percent={animatedPercent}>
                    <ProgressLabel>{safe}%</ProgressLabel>
                </ProgressFill>
            </ProgressBar>
        </ProgressWrapper>
    );
}
