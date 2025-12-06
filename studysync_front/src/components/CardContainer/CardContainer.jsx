import {
    CardContainer,
    TimeBox,
    TasksBox,
    DailyBox,
    WeeklyBox,
    SessionsBox,
    DeadlinesBox,
} from "./CardContainer.style";
import Card from "../Card/Card";

const CardContainerComp = () => {
    return (
        <CardContainer>
            <TimeBox>
                <Card>10:40</Card>
            </TimeBox>

            <DailyBox>
                <Card>Daily progress</Card>
            </DailyBox>

            <TasksBox>
                <Card>Today's tasks</Card>
            </TasksBox>

            <WeeklyBox>
                <Card>Weekly progress</Card>
            </WeeklyBox>

            <SessionsBox>
                <Card>Upcoming sessions</Card>
            </SessionsBox>

            <DeadlinesBox>
                <Card>Upcoming deadlines</Card>
            </DeadlinesBox>
        </CardContainer>
    );
};

export default CardContainerComp;