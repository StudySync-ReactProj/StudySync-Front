import React, { useEffect, useMemo, useState } from "react";
import {
    WeeklyWrapper,
    ChartWrapper,
    LegendRow,
    LegendItem,
    LegendSwatch,
    InnerChart,
    BarsRow,
    DayCol,
    BarStack,
    GoalBar,
    StudiedBar,
    DayLabel,
} from "./WeeklyProgress.style";

const DAYS = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];

// Convert value to percent of max (0-100)
function toPercent(value, max) {
    if (!max) return 0;
    return Math.round((value / max) * 100);
}

// Build a safe fallback week (if server returns empty)
function buildFallbackWeek(goalMinutesPerDay = 60) {
    return DAYS.map((day) => ({
        day,
        studiedMinutes: 0,
        goalMinutes: goalMinutesPerDay,
    }));
}

export default function WeeklyProgress({
    weeklyData = [],          // <-- NEW: data from server
    loading = false,
    error = null,
    goalMinutesPerDay = 60,   // fallback goal if missing
}) {
    // Ensure we always have 7 days to render
    const weekData = useMemo(() => {
        if (!Array.isArray(weeklyData) || weeklyData.length === 0) {
            return buildFallbackWeek(goalMinutesPerDay);
        }

        // Normalize and fallback missing fields
        const normalized = weeklyData.map((d, idx) => ({
            day: d.day || DAYS[idx] || "DAY",
            studiedMinutes: Number(d.studiedMinutes || 0),
            goalMinutes: Number(d.goalMinutes || goalMinutesPerDay),
        }));

        // If server sent less than 7 items, fill the rest
        if (normalized.length < 7) {
            const missing = 7 - normalized.length;
            return normalized.concat(buildFallbackWeek(goalMinutesPerDay).slice(0, missing));
        }

        // If server sent more than 7, take the last 7
        return normalized.slice(-7);
    }, [weeklyData, goalMinutesPerDay]);

    // Max goal for consistent bar scaling
    const maxGoal = useMemo(() => {
        return Math.max(1, ...weekData.map((d) => d.goalMinutes || 1));
    }, [weekData]);

    // Prepare chart values as percentages
    const chart = useMemo(() => {
        return weekData.map((d) => {
            const studiedCapped = Math.min(d.studiedMinutes, d.goalMinutes);
            const studiedPct = toPercent(studiedCapped, maxGoal);
            return { ...d, studiedPct };
        });
    }, [weekData, maxGoal]);

    // Simple mount animation
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        const id = setTimeout(() => setAnimate(true), 60);
        return () => clearTimeout(id);
    }, []);

    if (loading) return <p>Loading weekly progress...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // Key to restart animation on data change
    const chartKey = `${chart.map((d) => `${d.day}-${d.studiedMinutes}-${d.goalMinutes}`).join("|")}`;

    return (
        <WeeklyWrapper>
            <ChartWrapper>
                <LegendRow>
                    <LegendItem>
                        <LegendSwatch variant="goal" />
                        <span>Goal</span>
                    </LegendItem>
                    <LegendItem>
                        <LegendSwatch variant="studied" />
                        <span>Time Studied</span>
                    </LegendItem>
                </LegendRow>

                <InnerChart key={chartKey}>
                    <BarsRow>
                        {chart.map((d) => (
                            <DayCol key={d.day}>
                                <BarStack>
                                    {/* Goal is always 100% height (relative to maxGoal) */}
                                    <GoalBar value={animate ? 100 : 0} />
                                    {/* Studied is % of maxGoal */}
                                    <StudiedBar value={animate ? d.studiedPct : 0} />
                                </BarStack>

                                <DayLabel>{d.day}</DayLabel>
                            </DayCol>
                        ))}
                    </BarsRow>
                </InnerChart>
            </ChartWrapper>
        </WeeklyWrapper>
    );
}
