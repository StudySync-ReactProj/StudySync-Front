import { useState } from "react";
import { useSelector } from "react-redux";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";
import dashboardData from "../../data/dashboardData.json";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";

const Dashboard = () => {
    const user = useSelector((state) => state.user.user);
    const [data] = useState(dashboardData);

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return 'Good morning';
        } else if (hour >= 12 && hour < 17) {
            return 'Good afternoon';
        } else if (hour >= 17 && hour < 22) {
            return 'Good evening';
        } else {
            return 'Good night';
        }
    };

    return (
        <div>
            <Wrapper >
                <MainTitle title={`${getGreeting()}, ${user?.username || 'User'}!`} />
                <div>
                    <CardContainerComp data={data} />
                </div>
            </Wrapper>
        </div>
    );
}

export default Dashboard;
