// DailyProgress.jsx
import React, { useEffect, useState } from "react";
import {
    ProgressWrapper,
    Subtitle,
    ProgressBar,
    ProgressFill,
    ProgressLabel,
} from "./DailyProgress.style";

// helper that returns a message based on percent complete
const getSubtitle = (percent) => {
    if (percent <= 0) return "Let's get started!";
    if (percent < 25) return "Good start — keep going!";
    if (percent < 50) return "You're getting closer!";
    if (percent < 75) return "Over halfway there!";
    if (percent < 100) return "Almost done!";
    return "Goal reached - great job!";
};

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
            <Subtitle>{getSubtitle(safe)}</Subtitle>

            <ProgressBar>
                <ProgressFill percent={animatedPercent}>
                    <ProgressLabel>{safe}%</ProgressLabel>
                </ProgressFill>
            </ProgressBar>
        </ProgressWrapper>
    );
}
