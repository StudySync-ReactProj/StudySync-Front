import { useState, useEffect } from "react";
import { useUser } from "../../Contex/UserContex";
import NavBar from "../../components/Header/Header.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";
import dashboardData from "../../data/dashboardData.json";

const Dashboard = ({ onLogout, onGoToTasks }) => {
    const { user } = useUser();
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(dashboardData);
    }, []);
    return (
        <div>
            <NavBar onLogout={onLogout} onGoToTasks={onGoToTasks} />
            <MainTitle title={`Good morning, ${user?.username || 'User'}!`} />
            <div>
                <CardContainerComp data={data} />
            </div>
        </div>
    );
}

export default Dashboard;
