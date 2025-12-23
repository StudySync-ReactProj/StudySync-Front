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

function startOfWeekSunday(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // 0=Sun
    d.setDate(d.getDate() - day);
    return d;
}

function toPercent(value, max) {
    if (!max) return 0;
    return Math.round((value / max) * 100);
}

// API של todos: אין תאריך -> מפזרים לפי id%7
function mapTasksToWeek(tasks, { goalMinutesPerDay = 120 } = {}) {
    const weekStart = startOfWeekSunday(new Date());

    const week = DAYS.map((day, idx) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + idx);
        return { day, date, goalMinutes: goalMinutesPerDay, studiedMinutes: 0 };
    });

    tasks.forEach((t) => {
        const idx = (t.id ?? 0) % 7;
        if (t.completed) week[idx].studiedMinutes += 30; // דמו: 30 דק לכל todo שהושלם
    });

    return week;
}

export default function WeeklyProgress({
    tasks = [],
    loading = false,
    error = null,
    goalMinutesPerDay = 120,
}) {
    const weekData = useMemo(
        () => mapTasksToWeek(tasks, { goalMinutesPerDay }),
        [tasks, goalMinutesPerDay]
    );

    // סקאלה (כרגע היעד אחיד, אבל נשאר כללי)
    const maxGoal = useMemo(
        () => Math.max(1, ...weekData.map((d) => d.goalMinutes)),
        [weekData]
    );

    // ✅ כמו בפיגמה:
    // Goal = עמודה כהה מלאה תמיד
    // Time Studied = שכבה בהירה מעל הכהה (overlay)
    const chart = useMemo(() => {
        return weekData.map((d) => {
            const studiedCapped = Math.min(d.studiedMinutes, d.goalMinutes);
            const studiedPct = toPercent(studiedCapped, maxGoal);
            return { ...d, studiedPct };
        });
    }, [weekData, maxGoal]);

    // אנימציה
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        const id = setTimeout(() => setAnimate(true), 60);
        return () => clearTimeout(id);
    }, []);

    if (loading) return <p>Loading weekly progress...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // remount לגרף כשהנתונים משתנים (שומר על אנימציה “מתחילה מחדש” בלי setState בתוך effect)
    const chartKey = `${tasks.length}-${goalMinutesPerDay}`;

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
                                    {/* ✅ Goal: עמודה כהה מלאה */}
                                    <GoalBar value={animate ? 100 : 0} />

                                    {/* ✅ Time Studied: בהיר מעל הכהה */}
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
