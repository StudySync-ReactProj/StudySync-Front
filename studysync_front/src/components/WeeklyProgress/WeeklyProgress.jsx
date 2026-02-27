import React, { useEffect, useMemo, useState } from "react";
import {
    WeeklyWrapper,
    ChartWrapper,
    LegendRow,
    LegendItem,
    LegendSwatch,
    ChartContainer,
    YAxisLabels,
    YAxisLabel,
    InnerChart,
    GridContainer,
    GridLine,
    BarsRow,
    DayCol,
    BarStack,
    GoalBar,
    StudiedBar,
    DayLabel,
} from "./WeeklyProgress.style";

const DAYS = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];

// Maximum Y-axis value in minutes (10 hours)
const MAX_MINUTES_AXIS = 600; // 10 hours

/**
 * Converts minutes to percentage height on the chart
 * @param {number} minutes - Time in minutes
 * @param {number} maxMinutes - Maximum value on Y-axis (default 600 for 10 hours)
 * @returns {number} Percentage (0-100)
 */
function minutesToPercent(minutes, maxMinutes = MAX_MINUTES_AXIS) {
    if (!maxMinutes || maxMinutes <= 0) return 0;
    // Cap at 100% to prevent bars from overflowing
    return Math.min(100, Math.round((minutes / maxMinutes) * 100));
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
    weeklyData = [],          // <-- data from server
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

    // Prepare chart values with dynamic scaling
    const chart = useMemo(() => {
        return weekData.map((d) => {
            // Scale both goal and studied minutes to percentages based on fixed 10-hour axis
            const goalPercent = minutesToPercent(d.goalMinutes);
            const studiedPercent = minutesToPercent(d.studiedMinutes);

            return {
                ...d,
                goalPercent,
                studiedPercent,
            };
        });
    }, [weekData]);

    // Simple mount animation
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        const id = setTimeout(() => setAnimate(true), 60);
        return () => clearTimeout(id);
    }, []);

    if (loading) return <p>Loading weekly progress...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // Get today's day name
    const today = new Date();
    const todayDayIndex = today.getDay();
    const todayDayName = DAYS[todayDayIndex];

    // Key to restart animation on data change
    const chartKey = `${chart.map((d) => `${d.day}-${d.studiedMinutes}-${d.goalMinutes}`).join("|")}`;

    // Y-axis labels: 8, 7, 6, 5, 4, 3, 2 hours
    const yAxisHours = [8, 6, 4, 2, 0];

    return (
        <WeeklyWrapper>
            <ChartWrapper>
                <LegendRow>
                    <LegendItem>
                        <LegendSwatch variant="goal" />
                        <span>Time Studied</span>
                    </LegendItem>
                    <LegendItem>
                        <LegendSwatch variant="studied" />
                        <span>Goal</span>
                    </LegendItem>
                </LegendRow>

                <ChartContainer>
                    {/* Y-Axis Labels */}
                    <YAxisLabels>
                        {yAxisHours.map((hour) => (
                            <YAxisLabel key={`axis-${hour}`}>{hour}h</YAxisLabel>
                        ))}
                    </YAxisLabels>

                    {/* Inner Chart with Grid and Bars */}
                    <InnerChart key={chartKey}>
                        {/* Grid Lines */}
                        <GridContainer>
                            {yAxisHours.map((hour) => (
                                <GridLine
                                    key={`grid-${hour}`}
                                    style={{
                                        bottom: `${((hour - 2) / 8) * 100}%`,
                                    }}
                                />
                            ))}
                        </GridContainer>

                        {/* Bars */}
                        <BarsRow>
                            {chart.map((d) => (
                                <DayCol key={d.day}>
                                    <BarStack>
                                        {/* Goal Bar - scaled to day's specific goal */}
                                        <GoalBar heightPercent={animate ? d.goalPercent : 0} />
                                        {/* Studied Bar - scaled to actual time studied */}
                                        <StudiedBar heightPercent={animate ? d.studiedPercent : 0} />
                                    </BarStack>

                                    <DayLabel isToday={d.day === todayDayName}>{d.day}</DayLabel>
                                </DayCol>
                            ))}
                        </BarsRow>
                    </InnerChart>
                </ChartContainer>
            </ChartWrapper>
        </WeeklyWrapper>
    );
}
