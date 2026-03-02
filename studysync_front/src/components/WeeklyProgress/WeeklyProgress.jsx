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

// Minimum axis in minutes (10 hours) but axis will grow if data requires it
const MIN_AXIS_MINUTES = 600; // 10 hours

/**
 * Converts minutes to percentage height on the chart relative to provided axis max
 * @param {number} minutes - Time in minutes
 * @param {number} maxMinutes - Maximum value on Y-axis
 * @returns {number} Percentage (0-100)
 */
function minutesToPercent(minutes, maxMinutes) {
    if (!maxMinutes || maxMinutes <= 0) return 0;
    return Math.round((minutes / maxMinutes) * 100);
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
    todayOverrideMinutes = null, // optional override applied to today's goal only
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
        let finalWeek;
        if (normalized.length < 7) {
            const missing = 7 - normalized.length;
            finalWeek = normalized.concat(buildFallbackWeek(goalMinutesPerDay).slice(0, missing));
        } else {
            // If server sent 7+ items, take the last 7
            finalWeek = normalized.slice(-7);
        }

        // Apply override to the last item (today) after finalizing the week array
        if (todayOverrideMinutes != null) {
            try {
                const lastIdx = finalWeek.length - 1;
                if (lastIdx >= 0 && finalWeek[lastIdx]) {
                    finalWeek[lastIdx] = { ...finalWeek[lastIdx], goalMinutes: Number(todayOverrideMinutes) };
                }
            } catch (e) {
                console.debug('WeeklyProgress: failed to apply todayOverrideMinutes to final week', e);
            }
        }

        return finalWeek;
    }, [weeklyData, goalMinutesPerDay, todayOverrideMinutes]);

    // Determine axis max so we never clamp studied values.
    const axisMax = useMemo(() => {
        const dataMax = weekData.reduce((acc, d) => {
            return Math.max(acc, Number(d.studiedMinutes || 0), Number(d.goalMinutes || 0));
        }, 0);
        return Math.max(MIN_AXIS_MINUTES, dataMax || MIN_AXIS_MINUTES);
    }, [weekData]);

    // Prepare chart values with dynamic scaling relative to axisMax
    const chart = useMemo(() => {
        return weekData.map((d) => {
            const goal = Number(d.goalMinutes || 0);
            const studied = Number(d.studiedMinutes || 0);

            const goalPercent = minutesToPercent(goal, axisMax);
            const studiedPercent = minutesToPercent(studied, axisMax);

            return {
                ...d,
                goalPercent,
                studiedPercent,
            };
        });
    }, [weekData, axisMax]);

    // Y-axis label points (in minutes) derived from axisMax - show 4 ticks
    const yAxisPoints = useMemo(() => {
        const pts = [1, 0.75, 0.5, 0.25, 0];
        return pts.map((p) => Math.round(axisMax * p));
    }, [axisMax]);

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
                        {yAxisPoints.map((mins) => (
                            <YAxisLabel key={`axis-${mins}`}>{Math.round(mins / 60)}h</YAxisLabel>
                        ))}
                    </YAxisLabels>

                    {/* Inner Chart with Grid and Bars */}
                    <InnerChart key={chartKey}>
                        {/* Grid Lines */}
                        <GridContainer>
                            {yAxisPoints.map((mins) => (
                                <GridLine
                                    key={`grid-${mins}`}
                                    style={{
                                        bottom: `${(mins / axisMax) * 100}%`,
                                    }}
                                />
                            ))}
                        </GridContainer>

                        {/* Bars */}
                        <BarsRow>
                            {chart.map((d) => (
                                <DayCol key={d.day} title={`${d.studiedMinutes} / ${d.goalMinutes} (${d.goalMinutes > 0 ? Math.round((d.studiedMinutes / d.goalMinutes) * 100) : 0}%)`}>
                                    <BarStack>
                                        {/* Goal Bar - thin visual reference for day's goal */}
                                        <GoalBar heightPercent={animate ? d.goalPercent : 0} />
                                        {/* Studied Bar - actual studied time */}
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
