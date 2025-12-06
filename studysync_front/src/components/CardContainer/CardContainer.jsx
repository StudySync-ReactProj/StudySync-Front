import { CardContainer } from "./CardContainer.style";
import Card from "../Card/Card";

const CardContainerComp = () => {
    return (
        <CardContainer>
            <Card>Daily progress</Card>
            <Card>Today's tasks</Card>
            <Card>Weekly progress</Card>
            <Card>Upcoming sessions</Card>
            <Card>Upcoming deadlines</Card>
        </CardContainer>
    );
};

export default CardContainerComp;
